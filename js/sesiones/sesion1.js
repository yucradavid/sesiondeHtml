window.SessionRegistry.register({
    id: 'sesion1',
    title: 'Sesión 1: Estructura (HTML)',
    baseHTML: '<!-- Empieza a codificar aquí -->\n\n',
    missions: [
        {
            id: 'm1',
            title: 'El Gran Título',
            desc: 'Usa <span class="tag-badge">&lt;h1&gt;</span> para tu nombre.',
            validate: doc => {
                const element = doc.querySelector('h1');
                return Boolean(element && element.textContent.trim().length > 0);
            }
        },
        {
            id: 'm2',
            title: 'Sobre ti',
            desc: 'Crea un párrafo con <span class="tag-badge">&lt;p&gt;</span>.',
            validate: doc => {
                const element = doc.querySelector('p');
                return Boolean(element && element.textContent.trim().length > 0);
            }
        },
        {
            id: 'm3',
            title: 'Añade una foto',
            desc: 'Usa <span class="tag-badge">&lt;img src="..."&gt;</span>.',
            validate: doc => {
                const element = doc.querySelector('img');
                return Boolean(element && element.hasAttribute('src') && element.getAttribute('src').length > 0);
            }
        },
        {
            id: 'm4',
            title: 'Un enlace',
            desc: 'Usa <span class="tag-badge">&lt;a href="..."&gt;</span>.',
            validate: doc => {
                const element = doc.querySelector('a');
                return Boolean(element && element.hasAttribute('href'));
            }
        }
    ]
});
