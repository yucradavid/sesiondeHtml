import {
    enterClassroom,
    requestTeacherHelp,
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
        currentProject: '',
        currentProjectData: null,
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
            document.getElementById('project-selector').addEventListener('change', event => {
                this.loadSession(this.currentSession, event.target.value).catch(error => this.showError(error));
            });
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
                    ? `Práctica en curso: ${SessionRegistry.catalog.find(session => session.id === control.sessionId)?.title || control.sessionId}`
                    : 'La práctica todavía no ha comenzado. Espera a que el docente la inicie.';
                document.getElementById('practice-status').className = control.active
                    ? 'bg-green-600/20 text-green-300 px-4 py-2 text-center'
                    : 'bg-amber-600/20 text-amber-200 px-4 py-2 text-center';
                this.editor.setOption('readOnly', !this.studentId || !control.active);
                document.getElementById('reset-button').disabled = !this.studentId || !control.active;
                const lockHint = document.getElementById('editor-lock-hint');
                lockHint.classList.toggle('hidden', Boolean(this.studentId && control.active));
                lockHint.textContent = !this.studentId
                    ? 'Inicia sesión para participar en la práctica.'
                    : 'La práctica está en pausa. Espera a que el docente la inicie para editar.';
                document.getElementById('project-selector').disabled = Boolean(
                    control.sessionId === this.currentSession
                    && control.projectId
                    && control.projectId !== 'all'
                );
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
            this.loadingSession = true;
            try {
                const session = await SessionRegistry.load(sessionId);
                this.currentSession = session.id;
                const projectSelector = document.getElementById('project-selector');
                const projectSelectorWrapper = document.getElementById('project-selector-wrapper');
                let missions = session.missions;
                let baseHTML = session.baseHTML;
                this.currentProjectData = null;

                if (session.projects) {
                    projectSelectorWrapper.classList.remove('hidden');
                    projectSelector.replaceChildren();
                    session.projects.forEach(project => {
                        const option = document.createElement('option');
                        option.value = project.id;
                        option.textContent = project.title;
                        projectSelector.appendChild(option);
                    });
                    const assignedProjectId = this.classControl.sessionId === sessionId
                        && this.classControl.projectId
                        && this.classControl.projectId !== 'all'
                        ? this.classControl.projectId
                        : projectId;
                    const selectedProject = session.projects.find(project => project.id === assignedProjectId)
                        || session.projects.find(project => project.id === this.currentProject)
                        || session.projects[0];
                    this.currentProject = selectedProject.id;
                    this.currentProjectData = selectedProject;
                    projectSelector.value = selectedProject.id;
                    projectSelector.disabled = Boolean(
                        this.classControl.sessionId === sessionId
                        && this.classControl.projectId
                        && this.classControl.projectId !== 'all'
                    );
                    missions = selectedProject.missions;
                    baseHTML = selectedProject.baseHTML;
                    document.getElementById('project-description').textContent = selectedProject.description;
                    document.getElementById('project-description').classList.remove('hidden');
                    document.getElementById('sidebar-title').textContent = session.title;
                } else {
                    projectSelectorWrapper.classList.add('hidden');
                    projectSelector.disabled = false;
                    document.getElementById('project-description').classList.add('hidden');
                    this.currentProject = '';
                    document.getElementById('sidebar-title').textContent = session.title;
                }

                const storedSessionProgress = this.progress[session.id] || {};
                const storedProjectProgress = this.currentProjectData
                    ? storedSessionProgress[this.currentProject] || (this.currentProject === 'primera-pagina' ? storedSessionProgress : {})
                    : storedSessionProgress;
                this.state = Object.fromEntries(missions.map(mission => [
                    mission.id,
                    Boolean(storedProjectProgress[mission.id])
                ]));
                this.currentMissions = missions;
                document.getElementById('session-selector').value = session.id;
                document.getElementById('editor-project-hint').textContent = this.currentProjectData
                    ? `Proyecto: ${this.currentProjectData.title.replace(/^\d+\.\s*/, '')}`
                    : `Práctica: ${session.title}`;

                const container = document.getElementById('missions-container');
                container.innerHTML = missions.map((mission, index) => `
                    <div class="mission-item bg-slate-800 rounded" id="mission-ui-${mission.id}">
                        <div class="font-bold text-white text-sm flex items-center mb-1">
                            <span class="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center mr-2 text-xs" id="icon-${mission.id}"><i class="fa-solid fa-lock"></i></span>
                            ${index + 1}. ${mission.title}
                        </div>
                        <p class="text-xs text-slate-400 ml-8">${mission.desc}</p>
                    </div>
                `).join('');
                document.getElementById('success-banner').classList.add('hidden');
                this.editor.setValue(baseHTML);
                this.updateIframe(baseHTML);
                missions.forEach(mission => {
                    if (this.state[mission.id]) this.markMissionComplete(mission.id, false);
                });
                this.updateRankUI();
            } finally {
                this.loadingSession = false;
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
                : 'La práctica está en marcha';
            document.getElementById('lobby-waiting-message').textContent = waiting
                ? 'Ya estás en la sala. Cuando el docente inicie la práctica, entrarás automáticamente al laboratorio.'
                : 'La práctica ha comenzado. Tu sala de espera se cerró y el laboratorio está listo.';
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
            if (this.loadingSession || !this.studentId || !this.classControl.active) return;
            const code = this.editor.getValue();
            this.updateIframe(code);
            this.validateMissions(code);
        },

        updateIframe(userCode) {
            const frame = document.getElementById('preview-frame');
            const doc = frame.contentDocument || frame.contentWindow.document;
            doc.open();
            doc.write((this.currentSession === 'sesion1' ? PREVIEW_STYLES : '') + userCode);
            doc.close();
        },

        validateMissions(code) {
            SessionRegistry.load(this.currentSession).then(session => {
                const virtualDoc = LabParser.parse(code);
                let changed = false;
                const missions = this.currentProjectData?.missions || session.missions;
                missions.forEach(mission => {
                    if (!this.state[mission.id] && mission.validate(virtualDoc)) {
                        this.state[mission.id] = true;
                        this.markMissionComplete(mission.id);
                        changed = true;
                    }
                });
                if (changed) {
                    const savedProgress = { ...(this.progress[this.currentSession] || {}) };
                    if (this.currentProjectData) {
                        if (this.currentProject === 'primera-pagina') {
                            ['m1', 'm2', 'm3', 'm4'].forEach(missionId => delete savedProgress[missionId]);
                        }
                        savedProgress[this.currentProject] = { ...this.state };
                    } else {
                        Object.assign(savedProgress, this.state);
                    }
                    this.progress[this.currentSession] = savedProgress;
                    this.updateRankUI();
                    saveStudentProgress(this.studentId, this.currentSession, this.progress[this.currentSession])
                        .catch(error => this.showError(error));
                }
            }).catch(error => this.showError(error));
        },

        markMissionComplete(missionId, celebrate = true) {
            const element = document.getElementById(`mission-ui-${missionId}`);
            if (!element) return;
            element.classList.add('completed');
            document.getElementById(`icon-${missionId}`).innerHTML = '<i class="fa-solid fa-check text-white"></i>';
            document.getElementById(`icon-${missionId}`).classList.replace('bg-slate-700', 'bg-green-500');
            if (celebrate && typeof confetti === 'function') {
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
                ? `Siguiente: ${nextMission.title}`
                : '¡Completaste todas las misiones de esta actividad!';
            if (percent === 0) badge.textContent = 'Rango: Novato 🥚';
            else if (percent < 0.5) badge.textContent = 'Rango: Aprendiz 🐥';
            else if (percent < 1) badge.textContent = 'Rango: Coder 💻';
            else {
                badge.textContent = 'Rango: Leyenda 👑';
                document.getElementById('success-banner').classList.remove('hidden');
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

        resetSession() {
            if (!this.studentId || !this.classControl.active) return;
            const sessionId = this.currentSession;
            const projectId = this.currentProject;
            const sessionProgress = { ...(this.progress[sessionId] || {}) };
            if (this.currentProjectData) {
                if (this.currentProject === 'primera-pagina') {
                    ['m1', 'm2', 'm3', 'm4'].forEach(missionId => delete sessionProgress[missionId]);
                }
                sessionProgress[projectId] = {};
            } else {
                Object.keys(this.state).forEach(missionId => delete sessionProgress[missionId]);
            }
            this.progress[sessionId] = sessionProgress;
            this.loadSession(sessionId, projectId).then(() => {
                return saveStudentProgress(this.studentId, sessionId, this.progress[sessionId]);
            }).catch(error => this.showError(error));
        },

        exportCode() {
            const html = `<!DOCTYPE html>\n<html lang="es">\n<head>\n<meta charset="utf-8">\n<title>Mi Proyecto</title>\n${this.currentSession === 'sesion1' ? PREVIEW_STYLES : ''}</head>\n<body>\n${this.editor.getValue()}\n</body>\n</html>`;
            const blob = new Blob([html], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `proyecto_${this.currentSession}${this.currentProject ? `_${this.currentProject}` : ''}.html`;
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
            this.editor.setOption('readOnly', !this.classControl.active);
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
            const message = document.getElementById('help-message').value.trim() || 'Necesito ayuda con la práctica.';
            sendButton.disabled = true;
            sendButton.textContent = 'Enviando…';
            try {
                await requestTeacherHelp(this.studentId, {
                    name: this.studentName,
                    avatar: this.studentAvatar,
                    message: message.slice(0, 300)
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
