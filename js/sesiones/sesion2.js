window.SessionRegistry.register({
    id: 'sesion2',
    title: 'Sesión 2: Diseño (CSS)',
    baseHTML: '<main class="pagina">\n  <h1>Mi Página Pintada</h1>\n  <p>Este texto necesita color.</p>\n  <article class="tarjeta">\n    <h2>Mi primer diseño</h2>\n    <p>Usa CSS para que esta tarjeta destaque.</p>\n    <a href="#">Explorar</a>\n  </article>\n</main>\n\n<style>\n  /* Escribe reglas CSS aquí */\n  \n</style>',
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
            desc: 'Dale un color de fondo a la página con <span class="tag-badge">body { background: ... }</span>.',
            validate: doc => {
                const style = doc.querySelector('style');
                return Boolean(style && style.textContent.includes('body') && style.textContent.includes('background'));
            }
        },
        {
            id: 'm3',
            title: 'Elige una tipografía',
            desc: 'Cambia la familia de letra de la página con <span class="tag-badge">font-family</span>.',
            validate: doc => {
                const style = doc.querySelector('style');
                return Boolean(style && style.textContent.includes('font-family'));
            }
        },
        {
            id: 'm4',
            title: 'Diseña una tarjeta',
            desc: 'Añade un borde y esquinas redondeadas a <span class="tag-badge">.tarjeta</span>.',
            validate: doc => {
                const style = doc.querySelector('style');
                return Boolean(
                    style
                    && style.textContent.includes('.tarjeta')
                    && style.textContent.includes('border')
                    && style.textContent.includes('border-radius')
                );
            }
        },
        {
            id: 'm5',
            title: 'Resalta el enlace al pasar el cursor',
            desc: 'Crea un estilo para <span class="tag-badge">a:hover</span> y cambia su color.',
            validate: doc => {
                const style = doc.querySelector('style');
                return Boolean(style && /a\s*:\s*hover/.test(style.textContent) && style.textContent.includes('color'));
            }
        }
    ]
});
