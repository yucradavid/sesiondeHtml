(function () {
    const { hasStyle } = window.MissionChecks;

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
        + '  /* Escribe aquí tus reglas: selector { propiedad: valor; } */\n'
        + '</style>';

    function cssMission(id, title, desc, hints, selector, property) {
        return { id, title, desc, hints, validate: doc => hasStyle(doc, selector, property) };
    }

    window.SessionRegistry.register({
        id: 'sesion2',
        number: 2,
        title: 'Sesión 2: Le doy estilo a mi página',
        area: 'CSS',
        minutes: 90,
        purpose: 'mejorar la apariencia de una página con colores, letras, bordes y espacios usando CSS.',
        product: 'Tu página decorada con tu propio estilo, descargada con el botón «Descargar».',
        vocabulary: ['CSS', 'regla', 'selector', 'propiedad', 'valor', 'clase'],
        criteria: [
            'Cambio los colores del texto y del fondo.',
            'Elijo una letra y un tamaño fáciles de leer.',
            'Uso bordes y espacios para ordenar el contenido.',
            'Hago que un botón o un enlace reaccione al cursor.'
        ],
        start: '¿Qué página web te parece bonita y fácil de leer? ¿Qué colores y letras usa?',
        closing: [
            '¿Qué propiedad CSS te gustó más y por qué?',
            '¿Cómo ayudan padding y margin a que la página se lea mejor?',
            '¿Qué cambiarías del diseño de tu página si tuvieras más tiempo?'
        ],
        // Cada subsesión empieza con el código que el estudiante dejó en la anterior.
        carryCode: true,
        baseHTML: cssStarter,
        projects: [
            {
                id: 'colores',
                title: 'Pinta tu página',
                description: 'Cambia los colores del título, de los párrafos y del fondo.',
                minutes: 15,
                learn: ['color', 'background-color'],
                baseHTML: cssStarter,
                missions: [
                    cssMission('m1', 'Pinta el título',
                        'Escribe una regla para <span class="tag-badge">h1</span> con la propiedad <span class="tag-badge">color</span>.',
                        [
                            'Una regla CSS tiene selector, llaves y propiedad: <code>selector { propiedad: valor; }</code>. Escríbela dentro de <code>&lt;style&gt;</code>.',
                            'Ejemplo: <code>h1 { color: purple; }</code>'
                        ],
                        'h1', 'color'),
                    cssMission('m2', 'Colorea los párrafos',
                        'Cambia el color del texto de los párrafos con el selector <span class="tag-badge">p</span>.',
                        [
                            'El selector <code>p</code> cambia todos los párrafos a la vez.',
                            'Ejemplo: <code>p { color: #334155; }</code>'
                        ],
                        'p', 'color'),
                    cssMission('m3', 'Elige un fondo',
                        'Dale un color de fondo a toda la página con <span class="tag-badge">body</span>.',
                        [
                            '<code>body</code> es toda la página. La propiedad del fondo es <code>background-color</code>.',
                            'Ejemplo: <code>body { background-color: lightyellow; }</code>'
                        ],
                        'body', 'background')
                ]
            },
            {
                id: 'tipografia',
                title: 'Letras con personalidad',
                description: 'Elige la letra, el tamaño y el espacio entre líneas para que tu página se lea mejor.',
                minutes: 15,
                learn: ['font-family', 'font-size', 'line-height', 'text-align'],
                baseHTML: cssStarter,
                missions: [
                    cssMission('m1', 'Elige una letra',
                        'Usa <span class="tag-badge">font-family</span> en <span class="tag-badge">body</span> para cambiar la letra de toda la página.',
                        [
                            'Escribe el nombre de una letra y, al final, una familia de respaldo: <code>sans-serif</code> o <code>serif</code>.',
                            'Ejemplo: <code>body { font-family: Verdana, sans-serif; }</code>'
                        ],
                        'body', 'font-family'),
                    cssMission('m2', 'Agranda los párrafos',
                        'Cambia el tamaño de la letra de los párrafos con <span class="tag-badge">font-size</span>.',
                        [
                            'Los tamaños se escriben en <code>px</code>. El tamaño normal es <code>16px</code>.',
                            'Ejemplo: <code>p { font-size: 18px; }</code>'
                        ],
                        'p', 'font-size'),
                    {
                        id: 'm3',
                        title: 'Separa las líneas',
                        desc: 'Usa <span class="tag-badge">line-height</span> en <span class="tag-badge">body</span> o en <span class="tag-badge">p</span> para dejar aire entre las líneas.',
                        hints: [
                            'Un valor entre <code>1.4</code> y <code>1.8</code> hace que el texto se lea mejor.',
                            'Ejemplo: <code>body { line-height: 1.6; }</code>'
                        ],
                        validate: doc => hasStyle(doc, 'body', 'line-height') || hasStyle(doc, 'p', 'line-height')
                    },
                    cssMission('m4', 'Centra el título',
                        'Usa <span class="tag-badge">text-align</span> en <span class="tag-badge">h1</span> para centrarlo.',
                        [
                            '<code>text-align</code> alinea el texto a la izquierda (<code>left</code>), al centro (<code>center</code>) o a la derecha (<code>right</code>).',
                            'Ejemplo: <code>h1 { text-align: center; }</code>'
                        ],
                        'h1', 'text-align')
                ]
            },
            {
                id: 'tarjetas',
                title: 'Cajas y espacios',
                description: 'Convierte el artículo con la clase «tarjeta» en una caja ordenada con borde, esquinas y espacios.',
                minutes: 20,
                learn: ['border', 'border-radius', 'padding', 'margin', 'box-shadow'],
                baseHTML: cssStarter,
                missions: [
                    cssMission('m1', 'Dibuja el borde',
                        'Agrega un borde a <span class="tag-badge">.tarjeta</span> con grosor, estilo y color.',
                        [
                            'El punto de <code>.tarjeta</code> indica una clase: en el HTML aparece como <code>class="tarjeta"</code>.',
                            'Ejemplo: <code>.tarjeta { border: 2px solid #6366f1; }</code>'
                        ],
                        '.tarjeta', 'border'),
                    cssMission('m2', 'Redondea las esquinas',
                        'Usa <span class="tag-badge">border-radius</span> en la tarjeta.',
                        [
                            'Mientras más grande el número, más redondas las esquinas.',
                            'Ejemplo: <code>.tarjeta { border-radius: 12px; }</code>'
                        ],
                        '.tarjeta', 'border-radius'),
                    cssMission('m3', 'Dale espacio por dentro',
                        'Usa <span class="tag-badge">padding</span> para separar el contenido del borde.',
                        [
                            '<code>padding</code> es el espacio entre el borde y el contenido, como el margen de una hoja.',
                            'Ejemplo: <code>.tarjeta { padding: 16px; }</code>'
                        ],
                        '.tarjeta', 'padding'),
                    cssMission('m4', 'Dale espacio por fuera',
                        'Usa <span class="tag-badge">margin</span> para separar la tarjeta del resto de la página.',
                        [
                            '<code>margin</code> es el espacio fuera del borde.',
                            'Ejemplo: <code>.tarjeta { margin: 24px; }</code>'
                        ],
                        '.tarjeta', 'margin'),
                    cssMission('m5', 'Agrega una sombra',
                        'Haz que la tarjeta destaque con <span class="tag-badge">box-shadow</span>.',
                        [
                            'La sombra lleva: movimiento horizontal, movimiento vertical, desenfoque y color.',
                            'Ejemplo: <code>.tarjeta { box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); }</code>'
                        ],
                        '.tarjeta', 'box-shadow')
                ]
            },
            {
                id: 'interaccion-responsive',
                title: 'Botones vivos y celular',
                challenge: true,
                description: 'Reto: haz que el botón y el enlace reaccionen, y que la tarjeta se vea bien en el celular.',
                minutes: 20,
                learn: ['button', ':hover', '@media', ':focus-visible'],
                baseHTML: cssStarter,
                missions: [
                    cssMission('m1', 'Diseña el botón',
                        'Cambia el color de fondo del botón usando el selector <span class="tag-badge">button</span>.',
                        [
                            'Combina un fondo oscuro con letra clara para que el botón se lea bien.',
                            'Ejemplo: <code>button { background-color: #10b981; color: white; }</code>'
                        ],
                        'button', 'background'),
                    {
                        id: 'm2',
                        title: 'Reacciona al cursor',
                        desc: 'Crea una regla <span class="tag-badge">a:hover</span> que cambie el color del enlace al pasar el cursor.',
                        hints: [
                            '<code>:hover</code> solo se aplica cuando el cursor está encima del elemento.',
                            'Ejemplo: <code>a:hover { color: crimson; }</code>'
                        ],
                        validate: doc => hasStyle(doc, 'a:hover', ['color', 'background'])
                    },
                    {
                        id: 'm3',
                        title: 'Adapta la tarjeta al celular',
                        desc: 'Agrega una regla <span class="tag-badge">@media</span> que incluya un estilo para <span class="tag-badge">.tarjeta</span>.',
                        hints: [
                            '<code>@media</code> aplica sus reglas solo en pantallas pequeñas. Dentro de sus llaves van reglas normales.',
                            'Ejemplo: <code>@media (max-width: 600px) { .tarjeta { margin: 8px; } }</code>'
                        ],
                        validate: doc => hasStyle(doc, '.tarjeta', '*', { inMedia: true })
                    },
                    cssMission('m4', 'Muestra el foco del teclado',
                        'Usa <span class="tag-badge">button:focus-visible</span> con <span class="tag-badge">outline</span> para que el botón se note al navegar con Tab.',
                        [
                            'Haz clic en la vista previa y pulsa Tab: <code>:focus-visible</code> marca el botón elegido con el teclado.',
                            'Ejemplo: <code>button:focus-visible { outline: 3px solid orange; }</code>'
                        ],
                        'button:focus-visible', 'outline')
                ]
            }
        ]
    });
})();
