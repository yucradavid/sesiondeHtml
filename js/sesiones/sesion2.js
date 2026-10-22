const cssStarter = '<main class="pagina">\n'
    + '  <h1>Mi Página Pintada</h1>\n'
    + '  <p>Este texto necesita color y estilo.</p>\n'
    + '  <article class="tarjeta">\n'
    + '    <h2>Mi primer diseño</h2>\n'
    + '    <p>Usa CSS para que esta tarjeta destaque.</p>\n'
    + '    <a href="https://example.com/">Visitar un sitio de ejemplo</a>\n'
    + '    <button type="button">Explorar</button>\n'
    + '  </article>\n'
    + '</main>\n\n'
    + '<style>\n'
    + '  /* Escribe tus reglas CSS aquí */\n'
    + '</style>';

function cssMission(id, title, desc, selector, property) {
    return {
        id,
        title,
        desc,
        validate: doc => {
            const style = doc.querySelector('style');
            if (!style) return false;
            const rule = new RegExp(`${selector}\\s*\\{[^}]*\\b${property}\\s*:`, 'i');
            return rule.test(style.textContent);
        }
    };
}

const projects = [
    {
        id: 'colores',
        title: '1. Primeros colores',
        description: 'Empieza cambiando colores sencillos en títulos, textos y fondo.',
        baseHTML: cssStarter,
        missions: [
            cssMission('m1', 'Pinta el título', 'Cambia el color de <span class="tag-badge">h1</span>.', 'h1', 'color'),
            cssMission('m2', 'Dale color al texto', 'Cambia el color de los párrafos con <span class="tag-badge">p</span>.', 'p', 'color'),
            cssMission('m3', 'Elige el fondo', 'Agrega un color de fondo para <span class="tag-badge">body</span>.', 'body', 'background(?:-color)?')
        ]
    },
    {
        id: 'tipografia',
        title: '2. Texto con personalidad',
        description: 'Ajusta la letra y el ritmo de lectura para que tu página se entienda mejor.',
        baseHTML: cssStarter,
        missions: [
            cssMission('m1', 'Elige una familia de letra', 'Usa <span class="tag-badge">font-family</span> en <span class="tag-badge">body</span>.', 'body', 'font-family'),
            cssMission('m2', 'Haz el texto más legible', 'Cambia el tamaño de letra de los párrafos.', 'p', 'font-size'),
            cssMission('m3', 'Mejora el espacio entre líneas', 'Usa <span class="tag-badge">line-height</span> para facilitar la lectura.', 'body', 'line-height')
        ]
    },
    {
        id: 'tarjetas',
        title: '3. Tarjetas y espacios',
        description: 'Organiza el contenido con bordes, márgenes, relleno y sombra.',
        baseHTML: cssStarter,
        missions: [
            cssMission('m1', 'Dibuja el borde', 'Agrega un borde a <span class="tag-badge">.tarjeta</span>.', '\\.tarjeta', 'border'),
            cssMission('m2', 'Redondea las esquinas', 'Usa <span class="tag-badge">border-radius</span> en la tarjeta.', '\\.tarjeta', 'border-radius'),
            cssMission('m3', 'Dale espacio interior', 'Usa <span class="tag-badge">padding</span> para separar el contenido del borde.', '\\.tarjeta', 'padding'),
            cssMission('m4', 'Separa la tarjeta', 'Usa <span class="tag-badge">margin</span> para dejar espacio alrededor de la tarjeta.', '\\.tarjeta', 'margin'),
            cssMission('m5', 'Agrega una sombra', 'Haz que la tarjeta destaque con <span class="tag-badge">box-shadow</span>.', '\\.tarjeta', 'box-shadow')
        ]
    },
    {
        id: 'interaccion-responsive',
        title: '4. Interacción y diseño adaptable',
        description: 'Crea controles interactivos y adapta la página a pantallas pequeñas.',
        baseHTML: cssStarter,
        missions: [
            cssMission('m1', 'Diseña el botón', 'Cambia el color del botón usando <span class="tag-badge">button</span>.', 'button', 'background(?:-color)?'),
            cssMission('m2', 'Resalta al pasar el cursor', 'Crea una regla <span class="tag-badge">a:hover</span> para el enlace.', 'a:hover', 'color'),
            {
                id: 'm3',
                title: 'Adapta la página a móviles',
                desc: 'Agrega una regla <span class="tag-badge">@media</span> que incluya un estilo para <span class="tag-badge">.tarjeta</span>.',
                validate: doc => /@media\b[\s\S]*?\.tarjeta\s*\{[^}]*\}/i.test(doc.querySelector('style')?.textContent || '')
            },
            {
                id: 'm4',
                title: 'Completa tu diseño',
                desc: 'Usa <span class="tag-badge">:focus-visible</span> para que el botón también se note al navegar con teclado.',
                validate: doc => /button\s*:\s*focus-visible\s*\{[^}]*\boutline\s*:/i.test(doc.querySelector('style')?.textContent || '')
            }
        ]
    }
];

window.SessionRegistry.register({
    id: 'sesion2',
    title: 'Sesión 2: Diseño (CSS)',
    baseHTML: cssStarter,
    projects,
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
