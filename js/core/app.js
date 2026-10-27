import {
    enterClassroom,
    requestTeacherHelp,
    recordMissionCompletion,
    saveStudentProgress,
    signInStudent,
    trackStudentPresence,
    updateStudentProfile,
    watchClassControl,
    watchHelpRequest,
    resumeStudent,
    isSupabaseConfigured
} from './supabase.js';
import { avatarStyles, createAvatarCharacter, createAvatarSeed, createAvatarValue } from './avatar.js';

(function () {
    function countCompleted(value) {
        if (value === true) return 1;
        if (!value || typeof value !== 'object') return 0;
        return Object.values(value).reduce((total, child) => total + countCompleted(child), 0);
    }

    function withoutLegacyMissionKeys(progress) {
        return Object.fromEntries(Object.entries(progress).filter(([key]) => !/^m\d+$/.test(key)));
    }

    // El código de cada subsesión se guarda en este navegador, igual que la cuenta anónima.
    const CODE_STORAGE_PREFIX = 'academia-web:codigo';

    function readStoredCode(key) {
        try {
            return window.localStorage.getItem(key);
        } catch (error) {
            return null;
        }
    }

    function writeStoredCode(key, code) {
        try {
            window.localStorage.setItem(key, code);
        } catch (error) {
            console.warn('No se pudo guardar el código en este navegador.', error.message);
        }
    }

    function fillTextList(element, items) {
        element.replaceChildren(...items.map(item => {
            const entry = document.createElement('li');
            entry.textContent = item;
            return entry;
        }));
    }

    const PREVIEW_STYLES = `
        <style>
            body { font-family: 'Segoe UI', sans-serif; padding: 20px; line-height: 1.6; }
            h1 { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 5px; }
            img { max-width: 100%; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            a { color: #e74c3c; font-weight: bold; text-decoration: none; }
            a:hover { text-decoration: underline; }
        </style>
    `;

    window.SystemApp = {
        editor: null,
        currentSession: 'sesion1',
        currentSessionData: null,
        currentProject: '',
        currentProjectData: null,
        hintsShown: {},
        codeSaveTimer: null,
        pendingCodeSave: null,
        studentName: '',
        studentAvatar: createAvatarValue('adventurer', createAvatarSeed()),
        studentId: '',
        presenceSubscription: null,
        progress: {},
        classControl: { active: false },
        classControlSubscription: null,
        state: {},
        currentMissions: [],
        loadingSession: false,
        observingExample: false,

        init() {
            this.editor = LabEditor.create(
                document.getElementById('code-editor'),
                () => this.handleCodeChange()
            );
            this.editor.setOption('readOnly', true);
            const selector = document.getElementById('session-selector');
            SessionRegistry.catalog.forEach(session => {
                const option = document.createElement('option');
                option.value = session.id;
                option.textContent = session.title;
                selector.appendChild(option);
            });
            selector.disabled = true;
            document.getElementById('subsession-roadmap').addEventListener('click', event => {
                const step = event.target.closest('[data-project-id]');
                if (!step || step.disabled || step.dataset.projectId === this.currentProject) return;
                this.loadSession(this.currentSession, step.dataset.projectId).catch(error => this.showError(error));
            });
            document.getElementById('missions-container').addEventListener('click', event => {
                const hintButton = event.target.closest('.mission-hint-button');
                if (hintButton) this.showNextHint(hintButton.dataset.missionId);
            });
            document.getElementById('success-banner').addEventListener('click', event => {
                const nextButton = event.target.closest('[data-next-project-id]');
                if (!nextButton) return;
                this.loadSession(this.currentSession, nextButton.dataset.nextProjectId).catch(error => this.showError(error));
            });
            window.addEventListener('pagehide', () => this.flushCodeSave());
            document.getElementById('help-form').addEventListener('submit', event => {
                event.preventDefault();
                this.submitHelpRequest().catch(error => this.showError(error));
            });
            document.getElementById('lobby-help-button').addEventListener('click', () => this.askForHelp());
            document.getElementById('avatar-form').addEventListener('submit', event => {
                event.preventDefault();
                this.saveAvatar().catch(error => this.showError(error));
            });
            document.getElementById('student-avatar-style').addEventListener('change', () => this.refreshAvatarPreview());
            document.getElementById('reroll-avatar').addEventListener('click', () => this.refreshAvatarPreview(true));
            document.getElementById('profile-avatar-style').addEventListener('change', () => this.refreshProfileAvatarPreview());
            document.getElementById('reroll-profile-avatar').addEventListener('click', () => this.refreshProfileAvatarPreview(true));
            document.querySelectorAll('[data-workspace-view]').forEach(button => {
                button.addEventListener('click', () => this.showWorkspaceView(button.dataset.workspaceView));
            });
            document.getElementById('session-panel-toggle').addEventListener('click', () => {
                this.toggleStudentSessionPanel();
            });
            this.refreshAvatarPreview();
            this.showWorkspaceView('panel-editor');
            LabEditor.initResizer();
            this.loadSession('sesion1').catch(error => this.showError(error));
            if (isSupabaseConfigured()) {
                resumeStudent().then(saved => {
                    if (!saved) return;
                    const avatar = saved.profile.avatar?.includes(':')
                        ? saved.profile.avatar
                        : createAvatarValue('adventurer', createAvatarSeed());
                    return this.enterAsStudent(saved.user, '', avatar);
                }).catch(error => {
                    const loginError = document.getElementById('student-login-error');
                    loginError.textContent = `No se pudo recuperar tu cuenta: ${error.message}`;
                    loginError.classList.remove('hidden');
                });
            }
        },

        async initializeSupabase() {
            if (this.classControlSubscription) return;
            this.classControlSubscription = watchClassControl(control => {
                const sessionChanged = control.sessionId && control.sessionId !== this.currentSession;
                const projectChanged = control.projectId !== this.classControl.projectId;
                this.classControl = control;
                this.setWaitingRoom(!control.active);
                document.getElementById('practice-status').textContent = control.active
                    ? `Clase en curso: ${SessionRegistry.catalog.find(session => session.id === control.sessionId)?.title || control.sessionId}`
                    : 'La clase todavía no ha comenzado. Espera a que el docente la inicie.';
                document.getElementById('practice-status').className = control.active
                    ? 'bg-green-600/20 text-green-300 px-4 py-2 text-center'
                    : 'bg-amber-600/20 text-amber-200 px-4 py-2 text-center';
                this.editor.setOption('readOnly', !this.studentId || !control.active || this.observingExample);
                document.getElementById('reset-button').disabled = !this.studentId || !control.active;
                const lockHint = document.getElementById('editor-lock-hint');
                lockHint.classList.toggle('hidden', Boolean(this.studentId && control.active));
                lockHint.textContent = !this.studentId
                    ? 'Entra con tu nombre para participar en la clase.'
                    : 'La clase está en pausa. Espera a que el docente la inicie para editar.';
                this.renderRoadmap();
                if (this.studentId) {
                    updateStudentProfile(this.studentId, { sessionId: control.sessionId || 'sesion1' })
                        .catch(error => this.showError(error));
                }
                if (sessionChanged || projectChanged) {
                    const projectId = control.projectId && control.projectId !== 'all' ? control.projectId : '';
                    this.loadSession(control.sessionId || 'sesion1', projectId).catch(error => this.showError(error));
                }
            }, error => this.showError(error));
        },

        async loadSession(sessionId, projectId = '') {
            this.flushCodeSave();
            this.loadingSession = true;
            try {
                const session = await SessionRegistry.load(sessionId);
                this.currentSession = session.id;
                this.currentSessionData = session;
                let missions = session.missions;
                let baseHTML = session.baseHTML;
                this.currentProjectData = null;
                const hasProjects = Array.isArray(session.projects) && session.projects.length > 0;

                if (hasProjects) {
                    const selectedProject = session.projects.find(project => project.id === (this.assignedProjectId(sessionId) || projectId))
                        || session.projects.find(project => project.id === this.currentProject)
                        || session.projects[0];
                    this.currentProject = selectedProject.id;
                    this.currentProjectData = selectedProject;
                    missions = selectedProject.missions;
                    baseHTML = selectedProject.baseHTML;
                } else {
                    this.currentProject = '';
                }
                document.getElementById('sidebar-title').textContent = session.title;

                let storedSessionProgress = this.progress[session.id] || {};
                if (hasProjects) {
                    const legacyMissionKeys = Object.keys(storedSessionProgress).filter(key => /^m\d+$/.test(key));
                    if (legacyMissionKeys.length) {
                        const firstProject = session.projects[0];
                        const migratedProgress = { ...storedSessionProgress };
                        const legacyProgress = Object.fromEntries(legacyMissionKeys.map(key => [key, migratedProgress[key]]));
                        legacyMissionKeys.forEach(key => delete migratedProgress[key]);
                        migratedProgress[firstProject.id] = {
                            ...legacyProgress,
                            ...(migratedProgress[firstProject.id] || {})
                        };
                        this.progress[session.id] = migratedProgress;
                        storedSessionProgress = migratedProgress;
                        if (this.studentId) {
                            saveStudentProgress(this.studentId, session.id, migratedProgress)
                                .catch(error => this.showError(error));
                        }
                    }
                }
                const storedProjectProgress = this.currentProjectData
                    ? storedSessionProgress[this.currentProject] || {}
                    : storedSessionProgress;
                this.state = Object.fromEntries(missions.map(mission => [
                    mission.id,
                    Boolean(storedProjectProgress[mission.id])
                ]));
                this.currentMissions = missions;
                this.hintsShown = {};
                document.getElementById('session-selector').value = session.id;
                document.getElementById('editor-project-hint').textContent = this.currentProjectData
                    ? `Subsesión ${this.subsessionNumber(this.currentProjectData)} · ${this.currentProjectData.title}`
                    : session.title;

                this.renderSessionBrief();
                this.renderRoadmap();
                this.renderSubsessionInfo();
                this.renderMissions();
                const savedCode = this.storedCode();
                const code = savedCode ?? baseHTML;
                this.observingExample = Boolean(this.currentProjectData?.exampleHTML && savedCode === null);
                this.editor.setValue(code);
                this.renderExample();
                this.updateRankUI();
            } finally {
                this.loadingSession = false;
            }
        },

        renderExample() {
            const panel = document.getElementById('worked-example');
            panel.hidden = !this.observingExample;
            const code = this.observingExample ? this.currentProjectData.exampleHTML : '';
            document.getElementById('example-code').textContent = code;
            const frame = document.getElementById('preview-frame');
            frame.title = this.observingExample ? 'Vista previa del ejemplo' : 'Vista previa de tu código';
            this.updateIframe(this.observingExample ? code : this.editor.getValue());
            this.editor.setOption('readOnly', !this.studentId || !this.classControl.active || this.observingExample);
        },

        startPractice() {
            if (!this.studentId || !this.classControl.active || !this.observingExample) return;
            this.observingExample = false;
            this.renderExample();
            // El modelo nunca entra en el editor ni en los validadores.
            this.scheduleCodeSave(this.editor.getValue());
            this.flushCodeSave();
            this.editor.focus();
        },

        assignedProjectId(sessionId) {
            return this.classControl.sessionId === sessionId
                && this.classControl.projectId
                && this.classControl.projectId !== 'all'
                ? this.classControl.projectId
                : '';
        },

        subsessionNumber(project) {
            const session = this.currentSessionData;
            const sessionNumber = session?.number
                || SessionRegistry.catalog.findIndex(entry => entry.id === session?.id) + 1;
            return `${sessionNumber}.${session.projects.indexOf(project) + 1}`;
        },

        completedInProject(project) {
            const saved = project === this.currentProjectData
                ? this.state
                : this.progress[this.currentSession]?.[project.id] || {};
            return project.missions.filter(mission => saved[mission.id]).length;
        },

        isProjectComplete(project) {
            return project.missions.length > 0 && this.completedInProject(project) === project.missions.length;
        },

        codeKey(projectId) {
            return `${CODE_STORAGE_PREFIX}:${this.studentId}:${this.currentSession}:${projectId || 'sesion-completa'}`;
        },

        storedCode() {
            if (!this.studentId) return null;
            const saved = readStoredCode(this.codeKey(this.currentProject));
            if (saved !== null || !this.currentSessionData?.carryCode || !this.currentProjectData) return saved;
            const projects = this.currentSessionData.projects;
            for (let index = projects.indexOf(this.currentProjectData) - 1; index >= 0; index -= 1) {
                const previous = readStoredCode(this.codeKey(projects[index].id));
                if (previous !== null) return previous;
            }
            return null;
        },

        scheduleCodeSave(code) {
            if (!this.studentId) return;
            const key = this.codeKey(this.currentProject);
            window.clearTimeout(this.codeSaveTimer);
            this.pendingCodeSave = () => writeStoredCode(key, code);
            this.codeSaveTimer = window.setTimeout(() => this.flushCodeSave(), 400);
        },

        flushCodeSave() {
            window.clearTimeout(this.codeSaveTimer);
            this.pendingCodeSave?.();
            this.pendingCodeSave = null;
        },

        renderSessionBrief() {
            const session = this.currentSessionData;
            const hasBrief = Boolean(session?.purpose);
            document.getElementById('session-brief').classList.toggle('hidden', !hasBrief);
            document.getElementById('lobby-session-brief').classList.toggle('hidden', !hasBrief);
            if (!hasBrief) return;
            document.getElementById('session-purpose').textContent = `Hoy aprenderé a ${session.purpose}`;
            document.getElementById('session-product').textContent = session.product || '';
            fillTextList(document.getElementById('session-vocabulary'), session.vocabulary || []);
            fillTextList(document.getElementById('session-criteria'), session.criteria || []);
            fillTextList(document.getElementById('session-challenge-criteria'), session.challengeCriteria || []);
            document.getElementById('session-challenge-row').classList.toggle('hidden', !session.challengeCriteria?.length);
            document.getElementById('session-competency').textContent = session.competency
                ? `${session.competency.name} Capacidad: ${session.competency.capacity}`
                : '';
            document.getElementById('session-competency-row').classList.toggle('hidden', !session.competency);
            document.getElementById('lobby-session-title').textContent = session.title;
            document.getElementById('lobby-session-purpose').textContent = `Hoy aprenderemos a ${session.purpose}`;
            document.getElementById('lobby-session-question').textContent = session.start || '';
            document.getElementById('lobby-session-question-row').classList.toggle('hidden', !session.start);
        },

        renderRoadmap() {
            const roadmap = document.getElementById('subsession-roadmap');
            const projects = this.currentSessionData?.projects || [];
            roadmap.replaceChildren();
            roadmap.classList.toggle('hidden', projects.length === 0);
            const assignedProjectId = this.assignedProjectId(this.currentSession);
            projects.forEach(project => {
                const isCurrent = project.id === this.currentProject;
                const isDone = this.isProjectComplete(project);
                const step = document.createElement('button');
                step.type = 'button';
                step.className = 'roadmap-step';
                step.dataset.projectId = project.id;
                step.classList.toggle('is-current', isCurrent);
                step.classList.toggle('is-done', isDone);
                step.classList.toggle('is-challenge', Boolean(project.challenge));
                if (isCurrent) step.setAttribute('aria-current', 'step');
                step.disabled = Boolean(assignedProjectId && assignedProjectId !== project.id);
                if (step.disabled) step.title = 'El docente asignó otra subsesión para esta clase.';

                const number = document.createElement('span');
                number.className = 'roadmap-number';
                number.textContent = this.subsessionNumber(project);
                const text = document.createElement('span');
                text.className = 'roadmap-text';
                const title = document.createElement('strong');
                title.textContent = project.title;
                const detail = document.createElement('small');
                detail.textContent = [
                    project.challenge ? 'Reto' : '',
                    `${this.completedInProject(project)}/${project.missions.length} misiones`,
                    project.minutes ? `${project.minutes} min` : ''
                ].filter(Boolean).join(' · ');
                text.append(title, detail);
                const state = document.createElement('span');
                state.className = 'roadmap-state';
                state.textContent = isDone ? 'Lograda' : isCurrent ? 'Ahora' : '';
                step.append(number, text, state);
                roadmap.appendChild(step);
            });
        },

        renderSubsessionInfo() {
            const project = this.currentProjectData;
            document.getElementById('subsession-info').classList.toggle('hidden', !project);
            const understanding = document.getElementById('understanding-panel');
            understanding.hidden = !project?.understanding?.length;
            understanding.open = false;
            fillTextList(document.getElementById('understanding-tasks'), (project?.understanding || []).map((task, index) => `${['Explica', 'Corrige', 'Prueba una variante'][index]}: ${task}`));
            if (!project) return;
            document.getElementById('subsession-title').textContent =
                `${this.subsessionNumber(project)} · ${project.title}`;
            document.getElementById('subsession-description').textContent = project.description || '';
            fillTextList(document.getElementById('subsession-learn'), project.learn || []);
            document.getElementById('subsession-learn-row').classList.toggle('hidden', !project.learn?.length);
            document.getElementById('subsession-idea').innerHTML = project.idea || '';
            document.getElementById('subsession-idea-row').classList.toggle('hidden', !project.idea);
        },

        renderMissions() {
            const container = document.getElementById('missions-container');
            container.replaceChildren();
            const currentMission = this.currentMissions.find(mission => !this.state[mission.id]);
            this.currentMissions.forEach((mission, index) => {
                const done = Boolean(this.state[mission.id]);
                const isCurrent = mission === currentMission;
                const item = document.createElement('details');
                item.className = 'mission-item';
                item.id = `mission-ui-${mission.id}`;
                item.classList.toggle('completed', done);
                item.classList.toggle('current', isCurrent);
                item.open = isCurrent;

                const summary = document.createElement('summary');
                summary.className = 'mission-summary';
                const marker = document.createElement('span');
                marker.className = 'mission-marker';
                if (done) marker.innerHTML = '<i class="fa-solid fa-check" aria-hidden="true"></i>';
                else marker.textContent = String(index + 1);
                const title = document.createElement('span');
                title.className = 'mission-title';
                title.textContent = done ? `${mission.title} (lograda)` : mission.title;
                summary.append(marker, title);
                if (isCurrent) {
                    const badge = document.createElement('span');
                    badge.className = 'mission-state';
                    badge.textContent = 'Ahora';
                    summary.appendChild(badge);
                }

                const body = document.createElement('div');
                body.className = 'mission-body';
                const desc = document.createElement('p');
                desc.className = 'mission-desc';
                desc.innerHTML = mission.desc;
                body.appendChild(desc);
                if (this.hintSteps(mission) && !done) {
                    const list = document.createElement('ol');
                    list.className = 'mission-hints';
                    list.id = `hints-${mission.id}`;
                    for (let step = 0; step < (this.hintsShown[mission.id] || 0); step += 1) {
                        list.appendChild(this.hintItem(mission, step));
                    }
                    const hintButton = document.createElement('button');
                    hintButton.type = 'button';
                    hintButton.className = 'mission-hint-button';
                    hintButton.dataset.missionId = mission.id;
                    body.append(list, hintButton);
                    this.updateHintButton(mission, hintButton);
                }
                item.append(summary, body);
                container.appendChild(item);
            });
        },

        // Una misión puede tener su propio video; si no, usa el de su subsesión.
        missionVideo(mission) {
            return mission.video || this.currentProjectData?.video || null;
        },

        // Las pistas escritas van primero y el video, si existe, es la última pista.
        hintSteps(mission) {
            return (mission.hints?.length || 0) + (this.missionVideo(mission) ? 1 : 0);
        },

        hintItem(mission, step) {
            const hints = mission.hints || [];
            if (step >= hints.length) return this.videoHint(this.missionVideo(mission));
            const entry = document.createElement('li');
            entry.innerHTML = hints[step];
            return entry;
        },

        videoHint(video) {
            const entry = document.createElement('li');
            entry.className = 'mission-video';
            const title = document.createElement('p');
            title.className = 'mission-video-title';
            title.innerHTML = '<i class="fa-solid fa-film" aria-hidden="true"></i>';
            title.append(` Mira el video: ${video.title}${video.note ? ` (${video.note})` : ''}`);
            const params = new URLSearchParams();
            if (video.start) params.set('start', String(video.start));
            if (video.end) params.set('end', String(video.end));
            const query = params.toString();
            const player = document.createElement('iframe');
            player.src = `https://www.youtube-nocookie.com/embed/${video.youtubeId}${query ? `?${query}` : ''}`;
            player.title = `Video de refuerzo: ${video.title}`;
            player.loading = 'lazy';
            player.referrerPolicy = 'strict-origin-when-cross-origin';
            player.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            player.allowFullscreen = true;
            const help = document.createElement('p');
            help.className = 'mission-video-help';
            help.textContent = window.location.protocol === 'file:'
                ? 'El video no se reproduce si abres el laboratorio como archivo. Ábrelo en YouTube o pide ayuda a tu docente.'
                : 'Si el video no carga, ábrelo en YouTube o pide ayuda a tu docente.';
            const link = document.createElement('a');
            link.href = `https://www.youtube.com/watch?v=${video.youtubeId}${video.start ? `&t=${video.start}s` : ''}`;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.textContent = 'Abrir el video en YouTube';
            entry.append(title, player, help, link);
            return entry;
        },

        updateHintButton(mission, button) {
            const shown = this.hintsShown[mission.id] || 0;
            const total = this.hintSteps(mission);
            const nextIsVideo = shown === (mission.hints?.length || 0) && Boolean(this.missionVideo(mission));
            button.hidden = shown >= total;
            button.innerHTML = `<i class="fa-solid ${nextIsVideo ? 'fa-film' : 'fa-lightbulb'}" aria-hidden="true"></i>`;
            const label = shown === 0
                ? 'Necesito una pista'
                : nextIsVideo ? 'Mira el video' : `Ver otra pista (${shown + 1} de ${total})`;
            button.append(` ${label}`);
        },

        showNextHint(missionId) {
            const mission = this.currentMissions.find(item => item.id === missionId);
            const list = document.getElementById(`hints-${missionId}`);
            const shown = this.hintsShown[missionId] || 0;
            if (!mission || !list || shown >= this.hintSteps(mission)) return;
            this.hintsShown[missionId] = shown + 1;
            list.appendChild(this.hintItem(mission, shown));
            this.updateHintButton(mission, list.nextElementSibling);
        },

        nextProject() {
            const projects = this.currentSessionData?.projects || [];
            if (!this.currentProjectData || this.assignedProjectId(this.currentSession)) return null;
            const currentIndex = projects.indexOf(this.currentProjectData);
            return projects.slice(currentIndex + 1).find(project => !this.isProjectComplete(project))
                || projects.slice(0, currentIndex).find(project => !this.isProjectComplete(project))
                || null;
        },

        renderCompletion() {
            const banner = document.getElementById('success-banner');
            banner.replaceChildren();
            const session = this.currentSessionData;
            const title = document.createElement('p');
            title.className = 'session-success-title';
            title.textContent = this.currentProjectData
                ? `¡Completaste las comprobaciones de la subsesión ${this.subsessionNumber(this.currentProjectData)}! 🎉`
                : '¡Sesión lograda! 🎉';
            banner.appendChild(title);
            const reminder = document.createElement('p');
            reminder.textContent = 'Ahora abre «Demuestra lo que aprendiste»: explica, corrige y prueba una variante. Tu docente revisará contigo estas evidencias antes de dar por logrado el aprendizaje.';
            banner.appendChild(reminder);
            document.getElementById('understanding-panel').open = true;

            const next = this.nextProject();
            if (next) {
                const nextButton = document.createElement('button');
                nextButton.type = 'button';
                nextButton.className = 'session-next-button';
                nextButton.dataset.nextProjectId = next.id;
                nextButton.textContent = `Seguir con ${this.subsessionNumber(next)} · ${next.title}`;
                banner.appendChild(nextButton);
            }

            const coreProjects = (session?.projects || []).filter(project => !project.challenge);
            const sessionDone = coreProjects.length
                ? coreProjects.every(project => this.isProjectComplete(project))
                : !this.currentProjectData;
            if (sessionDone && session?.closing?.length) {
                const closing = document.createElement('section');
                closing.className = 'session-closing';
                const heading = document.createElement('h3');
                heading.textContent = 'Cierre de la sesión';
                const intro = document.createElement('p');
                intro.textContent = 'Antes de terminar, responde en tu cuaderno o conversa con tu grupo:';
                const questions = document.createElement('ol');
                fillTextList(questions, session.closing);
                const download = document.createElement('p');
                download.textContent = 'No olvides guardar tu trabajo con el botón «Descargar».';
                closing.append(heading, intro, questions, download);
                banner.appendChild(closing);
            }
        },

        refreshAvatarPreview(regenerate = false) {
            const style = document.getElementById('student-avatar-style').value;
            const current = this.studentAvatar.split(':').slice(1).join(':');
            const seed = regenerate || !current ? createAvatarSeed() : current;
            this.studentAvatar = createAvatarValue(style, seed);
            const preview = document.getElementById('student-avatar-preview');
            const character = createAvatarCharacter(this.studentAvatar, 'Vista previa', 'preview');
            character.id = preview.id;
            preview.replaceWith(character);
        },

        refreshProfileAvatarPreview(regenerate = false) {
            const style = document.getElementById('profile-avatar-style').value;
            const current = this.pendingAvatarSeed || createAvatarSeed();
            this.pendingAvatarSeed = regenerate || !this.pendingAvatarSeed ? createAvatarSeed() : current;
            const preview = document.getElementById('profile-avatar-preview');
            const character = createAvatarCharacter(
                createAvatarValue(style, this.pendingAvatarSeed),
                'Vista previa',
                'preview'
            );
            character.id = preview.id;
            preview.replaceWith(character);
        },

        renderClassmates(classmates) {
            const roster = document.getElementById('lobby-students');
            roster.replaceChildren();
            document.getElementById('lobby-friend-count').textContent =
                `${classmates.length} ${classmates.length === 1 ? 'conectado' : 'conectados'}`;
            if (classmates.length === 0) {
                const empty = document.createElement('p');
                empty.className = 'lobby-empty';
                empty.textContent = 'Todavía no hay compañeros conectados. ¡Avísales que ya estás aquí!';
                roster.appendChild(empty);
                return;
            }
            classmates.forEach(classmate => {
                const card = document.createElement('article');
                card.className = 'lobby-student';
                const avatar = createAvatarCharacter(classmate.avatar, classmate.name, 'lobby');
                const name = document.createElement('strong');
                name.textContent = classmate.name;
                const status = document.createElement('span');
                status.textContent = 'En la sala';
                card.append(avatar, name, status);
                roster.appendChild(card);
            });
        },

        setWaitingRoom(waiting) {
            if (!this.studentId) return;
            const lobby = document.getElementById('class-lobby');
            document.body.classList.toggle('waiting-for-teacher', waiting);
            lobby.classList.toggle('hidden', !waiting);
            document.getElementById('lobby-summary').textContent = waiting
                ? 'Esperando al docente'
                : 'La clase está en marcha';
            document.getElementById('lobby-waiting-message').textContent = waiting
                ? 'Ya estás en la sala. Cuando el docente inicie la clase, entrarás automáticamente al laboratorio.'
                : 'La clase ha comenzado. Tu sala de espera se cerró y el laboratorio está listo.';
            if (waiting) {
                this.updateStudentAvatarInUI();
            }
        },

        openAvatarDialog() {
            const [style, ...seedParts] = this.studentAvatar.split(':');
            document.getElementById('profile-avatar-style').value = avatarStyles.includes(style) ? style : 'adventurer';
            this.pendingAvatarSeed = seedParts.join(':') || createAvatarSeed();
            this.refreshProfileAvatarPreview();
            document.getElementById('avatar-form-error').classList.add('hidden');
            document.getElementById('avatar-dialog').classList.remove('hidden');
        },

        closeAvatarDialog() {
            document.getElementById('avatar-dialog').classList.add('hidden');
        },

        async saveAvatar() {
            const button = document.getElementById('save-avatar-button');
            const error = document.getElementById('avatar-form-error');
            const style = document.getElementById('profile-avatar-style').value;
            const avatar = createAvatarValue(style, this.pendingAvatarSeed);
            button.disabled = true;
            button.textContent = 'Guardando…';
            error.classList.add('hidden');
            try {
                await updateStudentProfile(this.studentId, { avatar });
                this.studentAvatar = avatar;
                await this.presenceSubscription?.();
                this.presenceSubscription = await trackStudentPresence(
                    { id: this.studentId },
                    {
                        name: this.studentName,
                        avatar,
                        sessionId: this.classControl.sessionId || this.currentSession,
                        onClassmates: classmates => this.renderClassmates(classmates)
                    }
                );
                this.updateStudentAvatarInUI();
                this.closeAvatarDialog();
            } catch (saveError) {
                error.textContent = `No se pudo guardar el avatar: ${saveError.message}`;
                error.classList.remove('hidden');
            } finally {
                button.disabled = false;
                button.textContent = 'Guardar avatar';
            }
        },

        updateStudentAvatarInUI() {
            const badge = document.getElementById('student-avatar-badge');
            const badgeCharacter = createAvatarCharacter(this.studentAvatar, this.studentName, 'badge');
            badgeCharacter.id = badge.id;
            badge.replaceWith(badgeCharacter);
            const lobbyAvatar = document.getElementById('lobby-own-avatar');
            const ownCharacter = createAvatarCharacter(this.studentAvatar, this.studentName, 'own');
            ownCharacter.id = lobbyAvatar.id;
            lobbyAvatar.replaceWith(ownCharacter);
            document.getElementById('student-identity').textContent = this.studentName;
            document.getElementById('edit-avatar-button').classList.remove('hidden');
        },

        handleCodeChange() {
            if (this.loadingSession || this.observingExample || !this.studentId || !this.classControl.active) return;
            const code = this.editor.getValue();
            this.updateIframe(code);
            this.scheduleCodeSave(code);
            this.validateMissions(code);
        },

        updateIframe(userCode) {
            const frame = document.getElementById('preview-frame');
            const doc = frame.contentDocument || frame.contentWindow.document;
            doc.open();
            doc.write((this.currentSession === 'sesion1' ? PREVIEW_STYLES : '') + userCode);
            this.enhancePreviewLinks(doc);
            doc.close();
        },

        enhancePreviewLinks(doc) {
            doc.querySelectorAll('a[href]').forEach(link => {
                const href = link.getAttribute('href')?.trim();
                if (!href || !/^(?:https?:)?\/\//i.test(href)) return;

                let url;
                try {
                    url = new URL(href.startsWith('//') ? `https:${href}` : href);
                } catch (error) {
                    console.warn('Se omitió un enlace externo con formato inválido.', error.message);
                    return;
                }

                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                link.dataset.externalLink = 'true';

                const videoId = this.youtubeVideoId(url);
                if (!videoId || link.dataset.videoEnhanced === 'true') return;

                const embed = doc.createElement('div');
                embed.className = 'preview-video-embed';
                embed.setAttribute('role', 'group');
                embed.setAttribute('aria-label', `Vista previa del video: ${link.textContent.trim() || 'YouTube'}`);
                embed.style.cssText = 'width:min(100%,560px);margin:14px 0;border-radius:12px;overflow:hidden;background:#111827;box-shadow:0 4px 14px rgba(15,23,42,.2)';
                const playerFrame = doc.createElement('div');
                playerFrame.style.cssText = 'width:100%;aspect-ratio:16/9;background:#111827';
                const player = doc.createElement('iframe');
                player.src = `https://www.youtube-nocookie.com/embed/${videoId}`;
                player.title = `Video de YouTube: ${link.textContent.trim() || 'video'}`;
                player.loading = 'lazy';
                player.referrerPolicy = 'strict-origin-when-cross-origin';
                player.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
                player.allowFullscreen = true;
                player.style.cssText = 'width:100%;height:100%;border:0';
                playerFrame.appendChild(player);
                const playbackNote = doc.createElement('p');
                playbackNote.textContent = window.location.protocol === 'file:'
                    ? 'YouTube bloquea la reproducción incrustada al abrir la página como archivo. Usa un servidor local o abre el video en YouTube.'
                    : 'Si el reproductor no carga, puedes abrir el video directamente en YouTube.';
                playbackNote.style.cssText = 'margin:0;padding:8px 12px 0;background:#f8fafc;color:#52627f;font:12px sans-serif';
                const fallbackLink = doc.createElement('a');
                fallbackLink.href = url.href;
                fallbackLink.target = '_blank';
                fallbackLink.rel = 'noopener noreferrer';
                fallbackLink.textContent = 'Abrir video en YouTube';
                fallbackLink.style.cssText = 'display:block;padding:6px 12px 10px;background:#f8fafc;color:#4338ca;font:600 13px sans-serif;text-decoration:underline';
                embed.append(playerFrame, playbackNote, fallbackLink);
                link.insertAdjacentElement('afterend', embed);
                link.dataset.videoEnhanced = 'true';
            });
        },

        youtubeVideoId(url) {
            const host = url.hostname.toLowerCase().replace(/^www\./, '');
            let videoId = '';
            if (host === 'youtu.be') {
                videoId = url.pathname.split('/').filter(Boolean)[0] || '';
            } else if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com') {
                const pathParts = url.pathname.split('/').filter(Boolean);
                if (url.pathname === '/watch') videoId = url.searchParams.get('v') || '';
                else if (['embed', 'shorts', 'live'].includes(pathParts[0])) videoId = pathParts[1] || '';
            }
            return /^[\w-]{11}$/.test(videoId) ? videoId : '';
        },

        validateMissions(code) {
            SessionRegistry.load(this.currentSession).then(session => {
                const virtualDoc = LabParser.parse(code);
                let changed = false;
                const newlyCompletedMissions = [];
                const missions = this.currentProjectData?.missions || session.missions;
                missions.forEach(mission => {
                    if (!this.state[mission.id] && mission.validate(virtualDoc)) {
                        this.state[mission.id] = true;
                        newlyCompletedMissions.push(mission.id);
                        changed = true;
                    }
                });
                if (changed) {
                    let savedProgress = { ...(this.progress[this.currentSession] || {}) };
                    if (this.currentProjectData) {
                        savedProgress = withoutLegacyMissionKeys(savedProgress);
                        savedProgress[this.currentProject] = { ...this.state };
                    } else {
                        Object.assign(savedProgress, this.state);
                    }
                    this.progress[this.currentSession] = savedProgress;
                    this.celebrate();
                    this.renderMissions();
                    this.renderRoadmap();
                    this.updateRankUI();
                    saveStudentProgress(this.studentId, this.currentSession, this.progress[this.currentSession])
                        .catch(error => this.showError(error));
                    newlyCompletedMissions.forEach(missionId => {
                        recordMissionCompletion(this.studentId, {
                            sessionId: this.currentSession,
                            projectId: this.currentProject || 'sesion-completa',
                            missionId
                        }).catch(error => this.showError(error));
                    });
                }
            }).catch(error => this.showError(error));
        },

        celebrate() {
            if (typeof confetti === 'function') {
                confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
            }
        },

        updateRankUI() {
            const total = Object.keys(this.state).length;
            const completed = Object.values(this.state).filter(Boolean).length;
            const badge = document.getElementById('level-badge');
            const points = countCompleted(this.progress) * 10;
            document.getElementById('points-badge').textContent = `Puntos: ${points}`;
            const percent = total ? completed / total : 0;
            const progressPercent = Math.round(percent * 100);
            const progressBar = document.getElementById('mission-progress-bar');
            document.getElementById('mission-progress-label').textContent = `${completed} de ${total} misiones`;
            document.getElementById('mission-progress-percent').textContent = `${progressPercent}%`;
            progressBar.setAttribute('aria-valuenow', String(progressPercent));
            document.getElementById('mission-progress-fill').style.width = `${progressPercent}%`;
            const nextMission = this.currentMissions.find(mission => !this.state[mission.id]);
            document.getElementById('next-mission-hint').textContent = nextMission
                ? `Ahora: ${nextMission.title}`
                : '¡Completaste todas las misiones de esta subsesión!';
            const banner = document.getElementById('success-banner');
            banner.classList.toggle('hidden', percent < 1);
            if (percent === 0) badge.textContent = 'Rango: Novato 🥚';
            else if (percent < 0.5) badge.textContent = 'Rango: Aprendiz 🐥';
            else if (percent < 1) badge.textContent = 'Rango: Coder 💻';
            else {
                badge.textContent = 'Rango: Leyenda 👑';
                this.renderCompletion();
            }
        },

        showWorkspaceView(panelId) {
            document.querySelectorAll('.workspace-tab').forEach(button => {
                const selected = button.dataset.workspaceView === panelId;
                button.classList.toggle('active', selected);
                button.setAttribute('aria-pressed', String(selected));
            });
            document.querySelectorAll('.workspace > .panel').forEach(panel => {
                panel.classList.toggle('mobile-panel-hidden', panel.id !== panelId);
            });
            document.getElementById('drag-me').classList.toggle('mobile-panel-hidden', panelId !== 'panel-editor');
            this.editor?.refresh();
        },

        toggleStudentSessionPanel() {
            const panel = document.getElementById('panel-sidebar');
            const button = document.getElementById('session-panel-toggle');
            const expanded = button.getAttribute('aria-expanded') === 'true';
            button.setAttribute('aria-expanded', String(!expanded));
            button.setAttribute(
                'aria-label',
                expanded ? 'Expandir sesiones y misiones' : 'Contraer sesiones y misiones'
            );
            panel.classList.toggle('sessions-collapsed', expanded);
        },

        resetSession() {
            if (!this.studentId || !this.classControl.active) return;
            const label = this.currentProjectData
                ? `la subsesión ${this.subsessionNumber(this.currentProjectData)}`
                : 'esta sesión';
            if (!window.confirm(`¿Reiniciar ${label}? Se borrará tu código y tus misiones logradas.`)) return;
            const sessionId = this.currentSession;
            const projectId = this.currentProject;
            let sessionProgress = { ...(this.progress[sessionId] || {}) };
            if (this.currentProjectData) {
                sessionProgress = withoutLegacyMissionKeys(sessionProgress);
                sessionProgress[projectId] = {};
            } else {
                Object.keys(this.state).forEach(missionId => delete sessionProgress[missionId]);
            }
            this.progress[sessionId] = sessionProgress;
            this.pendingCodeSave = null;
            writeStoredCode(
                this.codeKey(projectId),
                this.currentProjectData?.baseHTML ?? this.currentSessionData?.baseHTML ?? ''
            );
            if (this.currentProjectData?.exampleHTML) {
                try { window.localStorage.removeItem(this.codeKey(projectId)); } catch (error) { console.warn(error); }
            }
            this.loadSession(sessionId, projectId).then(() => {
                return saveStudentProgress(this.studentId, sessionId, this.progress[sessionId]);
            }).catch(error => this.showError(error));
        },

        exportCode() {
            const pageTitle = this.currentProjectData?.title || this.currentSessionData?.title || 'Mi página';
            const html = `<!DOCTYPE html>\n<html lang="es">\n<head>\n<meta charset="utf-8">\n<title>${pageTitle}</title>\n${this.currentSession === 'sesion1' ? PREVIEW_STYLES : ''}</head>\n<body>\n${this.editor.getValue()}\n</body>\n</html>`;
            const blob = new Blob([html], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `mi-pagina_${this.currentSession}${this.currentProject ? `_${this.currentProject}` : ''}.html`;
            link.click();
            window.setTimeout(() => URL.revokeObjectURL(url), 1000);
        },

        async loginStudent() {
            const name = document.getElementById('student-name').value.trim();
            if (!name) {
                document.getElementById('student-error').classList.remove('hidden');
                document.getElementById('student-name').focus();
                return;
            }
            document.getElementById('student-error').classList.add('hidden');
            try {
                const selectedStyle = document.getElementById('student-avatar-style').value;
                this.studentAvatar = createAvatarValue(selectedStyle, this.studentAvatar.split(':').slice(1).join(':'));
                const user = await signInStudent();
                await this.enterAsStudent(user, name, this.studentAvatar);
            } catch (error) {
                const loginError = document.getElementById('student-login-error');
                loginError.textContent = `No se pudo conectar: ${error.message}`;
                loginError.classList.remove('hidden');
            }
        },

        async enterAsStudent(user, name, avatar) {
            this.studentId = user.id;
            const student = await enterClassroom(user, name, avatar);
            this.studentName = student.name;
            this.studentAvatar = student.avatar;
            this.progress = student.progress || {};
            await this.initializeSupabase();
            await this.presenceSubscription?.();
            this.presenceSubscription = await trackStudentPresence(user, {
                name: this.studentName,
                avatar: this.studentAvatar,
                sessionId: this.classControl.sessionId || student.sessionId,
                onClassmates: classmates => this.renderClassmates(classmates)
            });
            document.getElementById('login-modal').classList.add('hidden');
            document.getElementById('student-login-error').classList.add('hidden');
            this.updateStudentAvatarInUI();
            this.setWaitingRoom(!this.classControl.active);
            document.getElementById('editor-lock-hint').classList.toggle('hidden', Boolean(this.classControl.active));
            this.editor.setOption('readOnly', !this.classControl.active || this.observingExample);
            document.getElementById('reset-button').disabled = !this.classControl.active;
            document.getElementById('help-button').disabled = false;
            document.getElementById('lobby-help-button').disabled = false;
            this.loadSession(this.classControl.sessionId || student.sessionId).catch(error => this.showError(error));
            watchHelpRequest(user.id, request => {
                const message = document.getElementById('help-response');
                if (request?.teacherMessage) {
                    message.textContent = `Respuesta del docente: ${request.teacherMessage}`;
                    message.classList.remove('hidden');
                } else {
                    message.classList.add('hidden');
                }
                const lobbyMessage = document.getElementById('lobby-help-response');
                lobbyMessage.textContent = message.textContent;
                lobbyMessage.classList.toggle('hidden', message.classList.contains('hidden'));
                document.getElementById('help-button').disabled = request?.status === 'pending';
                document.getElementById('lobby-help-button').disabled = request?.status === 'pending';
                document.getElementById('help-button').textContent = request?.status === 'answered'
                    ? 'Pedir otra ayuda'
                    : request?.status === 'pending'
                        ? 'Solicitud enviada'
                        : 'Pedir ayuda al docente';
                document.getElementById('lobby-help-button').textContent = request?.status === 'answered'
                    ? 'Pedir otra ayuda'
                    : request?.status === 'pending'
                        ? 'Solicitud enviada'
                        : 'Pedir ayuda al docente';
            }, error => this.showError(error));
        },

        async askForHelp() {
            if (!this.studentId) return;
            const dialog = document.getElementById('help-dialog');
            document.getElementById('help-form-error').classList.add('hidden');
            document.getElementById('help-message').value = '';
            dialog.classList.remove('hidden');
            document.getElementById('help-message').focus();
        },

        closeHelpDialog() {
            document.getElementById('help-dialog').classList.add('hidden');
        },

        async submitHelpRequest() {
            if (!this.studentId) return;
            const sendButton = document.getElementById('send-help-button');
            const errorElement = document.getElementById('help-form-error');
            const typedMessage = document.getElementById('help-message').value.trim() || 'Necesito ayuda.';
            const context = this.helpContext();
            const message = context
                ? `${typedMessage.slice(0, 300 - context.length - 3)} (${context})`
                : typedMessage.slice(0, 300);
            sendButton.disabled = true;
            sendButton.textContent = 'Enviando…';
            try {
                await requestTeacherHelp(this.studentId, {
                    name: this.studentName,
                    avatar: this.studentAvatar,
                    message
                });
                this.closeHelpDialog();
                document.getElementById('help-response').textContent = 'Solicitud enviada. El docente te responderá aquí.';
                document.getElementById('help-response').classList.remove('hidden');
            } catch (error) {
                errorElement.textContent = `No se pudo enviar: ${error.message}`;
                errorElement.classList.remove('hidden');
            } finally {
                sendButton.disabled = false;
                sendButton.textContent = 'Enviar solicitud';
            }
        },

        // Le dice al docente dónde está el estudiante sin que tenga que explicarlo.
        helpContext() {
            const missionIndex = this.currentMissions.findIndex(mission => !this.state[mission.id]);
            const parts = [
                this.currentProjectData
                    ? `Subsesión ${this.subsessionNumber(this.currentProjectData)}`
                    : this.currentSessionData?.title,
                missionIndex >= 0 ? `misión ${missionIndex + 1}: ${this.currentMissions[missionIndex].title}` : ''
            ];
            return parts.filter(Boolean).join(', ').slice(0, 120);
        },

        showError(error) {
            console.error('Error en el laboratorio:', error);
            const toast = document.getElementById('student-toast');
            toast.textContent = `No se pudo completar la operación: ${error.message}`;
            toast.classList.remove('hidden');
            window.clearTimeout(this.toastTimeout);
            this.toastTimeout = window.setTimeout(() => toast.classList.add('hidden'), 6000);
        }
    };

    window.addEventListener('DOMContentLoaded', () => window.SystemApp.init());
})();
