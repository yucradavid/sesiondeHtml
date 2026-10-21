(function () {
    const catalog = [
        { id: 'sesion1', title: 'Sesión 1: Proyectos con HTML', src: 'js/sesiones/sesion1.js' },
        { id: 'sesion2', title: 'Sesión 2: Diseño (CSS)', src: 'js/sesiones/sesion2.js' }
    ];
    const sessions = new Map();
    const pendingLoads = new Map();

    window.SessionRegistry = {
        catalog,
        register(session) {
            if (!session || !catalog.some(item => item.id === session.id)) {
                throw new Error('Se intentó registrar una sesión desconocida.');
            }
            sessions.set(session.id, session);
        },
        async load(sessionId) {
            if (sessions.has(sessionId)) return sessions.get(sessionId);
            const entry = catalog.find(item => item.id === sessionId);
            if (!entry) throw new Error(`No existe la sesión "${sessionId}".`);
            if (!pendingLoads.has(sessionId)) {
                const loadPromise = new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = entry.src;
                    script.onload = () => {
                        const session = sessions.get(sessionId);
                        if (session) resolve(session);
                        else reject(new Error(`El archivo de ${sessionId} no registró la sesión.`));
                    };
                    script.onerror = () => reject(new Error(`No se pudo cargar ${entry.src}.`));
                    document.head.appendChild(script);
                }).catch(error => {
                    pendingLoads.delete(sessionId);
                    throw error;
                });
                pendingLoads.set(sessionId, loadPromise);
            }
            return pendingLoads.get(sessionId);
        }
    };
})();
