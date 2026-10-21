import {
    enterClassroom,
    requestTeacherHelp,
    saveStudentProgress,
    signInStudent,
    trackStudentPresence,
    updateStudentProfile,
    watchClassControl,
    watchHelpRequest
} from './supabase.js';

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
        studentAvatar: '🦊',
        studentId: '',
        presenceSubscription: null,
        progress: {},
        classControl: { active: false },
        classControlSubscription: null,
        state: {},
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
            LabEditor.initResizer();
            this.loadSession('sesion1').catch(error => this.showError(error));
        },

        async initializeSupabase() {
            if (this.classControlSubscription) return;
            this.classControlSubscription = watchClassControl(control => {
                const sessionChanged = control.sessionId && control.sessionId !== this.currentSession;
                this.classControl = control;
                document.getElementById('practice-status').textContent = control.active
                    ? `Práctica en curso: ${SessionRegistry.catalog.find(session => session.id === control.sessionId)?.title || control.sessionId}`
                    : 'La práctica todavía no ha comenzado. Espera a que el docente la inicie.';
                document.getElementById('practice-status').className = control.active
                    ? 'bg-green-600/20 text-green-300 px-4 py-2 text-center'
                    : 'bg-amber-600/20 text-amber-200 px-4 py-2 text-center';
                this.editor.setOption('readOnly', !this.studentId || !control.active);
                document.getElementById('reset-button').disabled = !this.studentId || !control.active;
                if (this.studentId) {
                    updateStudentProfile(this.studentId, { sessionId: control.sessionId || 'sesion1' })
                        .catch(error => this.showError(error));
                }
                if (sessionChanged) this.loadSession(control.sessionId).catch(error => this.showError(error));
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
                    const selectedProject = session.projects.find(project => project.id === projectId)
                        || session.projects.find(project => project.id === this.currentProject)
                        || session.projects[0];
                    this.currentProject = selectedProject.id;
                    this.currentProjectData = selectedProject;
                    projectSelector.value = selectedProject.id;
                    missions = selectedProject.missions;
                    baseHTML = selectedProject.baseHTML;
                    document.getElementById('project-description').textContent = selectedProject.description;
                    document.getElementById('project-description').classList.remove('hidden');
                    document.getElementById('sidebar-title').textContent = session.title;
                } else {
                    projectSelectorWrapper.classList.add('hidden');
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
                    if (this.state[mission.id]) this.markMissionComplete(mission.id);
                });
                this.updateRankUI();
            } finally {
                this.loadingSession = false;
            }
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

        markMissionComplete(missionId) {
            const element = document.getElementById(`mission-ui-${missionId}`);
            if (!element) return;
            element.classList.add('completed');
            document.getElementById(`icon-${missionId}`).innerHTML = '<i class="fa-solid fa-check text-white"></i>';
            document.getElementById(`icon-${missionId}`).classList.replace('bg-slate-700', 'bg-green-500');
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
            if (percent === 0) badge.textContent = 'Rango: Novato 🥚';
            else if (percent < 0.5) badge.textContent = 'Rango: Aprendiz 🐥';
            else if (percent < 1) badge.textContent = 'Rango: Coder 💻';
            else {
                badge.textContent = 'Rango: Leyenda 👑';
                document.getElementById('success-banner').classList.remove('hidden');
            }
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
                this.studentAvatar = document.getElementById('student-avatar').value;
                const user = await signInStudent();
                this.studentId = user.id;
                this.studentName = name;
                const student = await enterClassroom(user, name, this.studentAvatar);
                this.progress = student.progress || {};
                await updateStudentProfile(user.id, { sessionId: this.classControl.sessionId || 'sesion1' });
                await this.initializeSupabase();
                this.presenceSubscription?.();
                this.presenceSubscription = await trackStudentPresence(user, {
                    name,
                    avatar: this.studentAvatar,
                    sessionId: this.classControl.sessionId || 'sesion1'
                });
                document.getElementById('login-modal').classList.add('hidden');
                document.getElementById('student-identity').textContent = `${this.studentAvatar} ${name}`;
                document.getElementById('student-login-error').classList.add('hidden');
                this.editor.setOption('readOnly', !this.classControl.active);
                document.getElementById('reset-button').disabled = !this.classControl.active;
                this.loadSession(this.classControl.sessionId || 'sesion1').catch(error => this.showError(error));
                watchHelpRequest(user.id, request => {
                    const message = document.getElementById('help-response');
                    if (request?.teacherMessage) {
                        message.textContent = `Respuesta del docente: ${request.teacherMessage}`;
                        message.classList.remove('hidden');
                    } else {
                        message.classList.add('hidden');
                    }
                    document.getElementById('help-button').disabled = Boolean(request?.status);
                    document.getElementById('help-button').textContent = request?.status === 'answered'
                        ? 'El docente respondió'
                        : request?.status === 'pending'
                            ? 'Solicitud enviada'
                            : 'Pedir ayuda al docente';
                }, error => this.showError(error));
            } catch (error) {
                const loginError = document.getElementById('student-login-error');
                loginError.textContent = `No se pudo conectar: ${error.message}`;
                loginError.classList.remove('hidden');
            }
        },

        async askForHelp() {
            if (!this.studentId) return;
            const answer = window.prompt('¿En qué necesitas ayuda? (opcional)', '');
            if (answer === null) return;
            const message = (answer.trim() || 'Necesito ayuda con la práctica.').slice(0, 300);
            try {
                await requestTeacherHelp(this.studentId, {
                    name: this.studentName,
                    avatar: this.studentAvatar,
                    message
                });
            } catch (error) {
                this.showError(error);
            }
        },

        showError(error) {
            console.error('Error en el laboratorio:', error);
            alert(`No se pudo completar la operación: ${error.message}`);
        }
    };

    window.addEventListener('DOMContentLoaded', () => window.SystemApp.init());
})();
