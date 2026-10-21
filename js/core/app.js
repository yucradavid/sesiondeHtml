(function () {
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
        studentName: '',
        state: {},
        loadingSession: false,

        init() {
            this.editor = LabEditor.create(
                document.getElementById('code-editor'),
                () => this.handleCodeChange()
            );
            const selector = document.getElementById('session-selector');
            SessionRegistry.catalog.forEach(session => {
                const option = document.createElement('option');
                option.value = session.id;
                option.textContent = session.title;
                selector.appendChild(option);
            });
            selector.addEventListener('change', event => {
                this.loadSession(event.target.value).catch(error => this.showError(error));
            });
            LabEditor.initResizer();
            this.loadSession('sesion1').catch(error => this.showError(error));
        },

        async loadSession(sessionId) {
            this.loadingSession = true;
            try {
                const session = await SessionRegistry.load(sessionId);
                this.currentSession = session.id;
                this.state = Object.fromEntries(session.missions.map(mission => [mission.id, false]));
                document.getElementById('session-selector').value = session.id;
                document.getElementById('sidebar-title').textContent = session.title;

                const container = document.getElementById('missions-container');
                container.innerHTML = session.missions.map((mission, index) => `
                    <div class="mission-item bg-slate-800 rounded" id="mission-ui-${mission.id}">
                        <div class="font-bold text-white text-sm flex items-center mb-1">
                            <span class="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center mr-2 text-xs" id="icon-${mission.id}"><i class="fa-solid fa-lock"></i></span>
                            ${index + 1}. ${mission.title}
                        </div>
                        <p class="text-xs text-slate-400 ml-8">${mission.desc}</p>
                    </div>
                `).join('');
                document.getElementById('success-banner').classList.add('hidden');
                this.editor.setValue(session.baseHTML);
                this.updateRankUI();
            } finally {
                this.loadingSession = false;
            }
        },

        handleCodeChange() {
            if (this.loadingSession) return;
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
                session.missions.forEach(mission => {
                    if (!this.state[mission.id] && mission.validate(virtualDoc)) {
                        this.state[mission.id] = true;
                        this.markMissionComplete(mission.id);
                        changed = true;
                    }
                });
                if (changed) {
                    this.updateRankUI();
                    this.saveToCloud();
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
            this.loadSession(this.currentSession).catch(error => this.showError(error));
        },

        exportCode() {
            const html = `<!DOCTYPE html>\n<html lang="es">\n<head>\n<meta charset="utf-8">\n<title>Mi Proyecto</title>\n${this.currentSession === 'sesion1' ? PREVIEW_STYLES : ''}</head>\n<body>\n${this.editor.getValue()}\n</body>\n</html>`;
            const blob = new Blob([html], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `proyecto_${this.currentSession}.html`;
            link.click();
            window.setTimeout(() => URL.revokeObjectURL(url), 1000);
        },

        loginStudent() {
            const name = document.getElementById('student-name').value.trim();
            if (!name) {
                document.getElementById('student-error').classList.remove('hidden');
                document.getElementById('student-name').focus();
                return;
            }
            document.getElementById('student-error').classList.add('hidden');
            this.studentName = name;
            document.getElementById('login-modal').classList.add('hidden');
            this.saveToCloud();
        },

        saveToCloud() {
            if (!this.studentName) return;
            const payload = {
                name: this.studentName,
                session: this.currentSession,
                state: this.state,
                lastUpdate: new Date().toLocaleTimeString()
            };
            try {
                LabDB.saveStudent(payload);
            } catch (error) {
                this.showError(new Error(`No se pudo guardar el progreso local: ${error.message}`));
            }
        },

        showError(error) {
            console.error('Error en el laboratorio:', error);
            alert(`No se pudo completar la operación: ${error.message}`);
        }
    };

    window.addEventListener('DOMContentLoaded', () => window.SystemApp.init());
})();
