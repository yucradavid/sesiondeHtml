window.SessionRegistry.register({
    id: 'sesion2',
    title: 'Sesión 2: Diseño (CSS)',
    baseHTML: '<h1>Mi Página Pintada</h1>\n<p>Este texto necesita color.</p>\n\n<style>\n  /* Escribe reglas CSS aquí */\n  \n</style>',
    missions: [
        {
            id: 'm1',
            title: 'Cambia el Título',
            desc: 'Dale color al h1',
            validate: doc => {
                const style = doc.querySelector('style');
                return Boolean(style && style.textContent.includes('h1') && style.textContent.includes('color'));
            }
        },
        {
            id: 'm2',
            title: 'Fondo de la página',
            desc: 'Cambia el background del body',
            validate: doc => {
                const style = doc.querySelector('style');
                return Boolean(style && style.textContent.includes('body') && style.textContent.includes('background'));
            }
        }
    ]
});
