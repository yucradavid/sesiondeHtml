(function () {
    const { hasStyle } = window.MissionChecks;

    const cssStarter = '<main>\n'
        + '  <h1>Mi Página Pintada</h1>\n'
        + '  <p>Este texto necesita color y estilo.</p>\n'
        + '  <article>\n'
        + '    <h2>Mi primer diseño</h2>\n'
        + '    <p>Usa CSS para que esta tarjeta destaque.</p>\n'
        + '    <a href="https://example.com/">Visitar un sitio de ejemplo</a>\n'
        + '    <button type="button">Explorar</button>\n'
        + '  </article>\n'
        + '</main>\n\n'
        + '<!-- Aquí escribirás tu bloque style. -->';

    function cssMission(id, title, desc, hints, selector, property) {
        return { id, title, desc, hints, validate: doc => (!selector.startsWith('.') || Boolean(doc.querySelector(selector))) && hasStyle(doc, selector, property) };
    }

    window.SessionRegistry.register({
        id: 'sesion2',
        number: 2,
        title: 'Sesión 2: Le doy estilo a mi página',
        area: 'CSS',
        minutes: 90,
        competency: {
            name: 'Se desenvuelve en entornos virtuales generados por las TIC (CNEB, competencia transversal).',
            capacity: 'Crea objetos virtuales en diversos formatos.'
        },
        purpose: 'mejorar la apariencia de una página con colores, letras, bordes y espacios usando CSS.',
        product: 'Tu página decorada con tu propio estilo, descargada con el botón «Descargar».',
        vocabulary: ['CSS', 'regla', 'selector', 'propiedad', 'valor', 'clase', 'contraste'],
        criteria: [
            'Cambio los colores del texto y del fondo, y compruebo que el texto se lea bien.',
            'Elijo una letra y un tamaño fáciles de leer.',
            'Uso bordes y espacios para ordenar el contenido.'
        ],
        challengeCriteria: [
            'Hago que un botón o un enlace reaccione al cursor y que la tarjeta se vea bien en el celular.'
        ],
        start: '¿Qué página web te parece bonita y fácil de leer? ¿Qué colores y letras usa?',
        closing: [
            '¿Qué propiedad CSS te gustó más y por qué?',
            '¿Cómo ayudan padding y margin a que la página se lea mejor?',
            'Mira tu página: ¿el texto se lee bien sobre el fondo? ¿Qué cambiarías?'
        ],
        // Cada subsesión empieza con el código que el estudiante dejó en la anterior.
        carryCode: true,
        baseHTML: cssStarter,
        projects: [
            {
                id: 'colores',
                understanding: ["En h1 { color: purple; }, identifica selector, propiedad y valor. ¿Dónde va esa regla y dónde va el h1?", "La regla h1 { color purple; } no tiene dos puntos. Escríbela correctamente en tu cuaderno y explica el cambio.", "Sin copiar otra regla, cambia el color de h2. Antes de escribir, predice qué textos cambiarán y luego compruébalo."],
                title: 'Pinta tu página',
                description: 'Conecta HTML y CSS: crea el bloque style y luego pinta los elementos por su etiqueta.',
                minutes: 15,
                learn: ['color', 'background-color'],
                idea: 'HTML crea el contenido y CSS cambia su apariencia. En este laboratorio escribimos ambos en el mismo editor: debajo de &lt;/main&gt;, escribe <code>&lt;style&gt;</code>, deja una línea y cierra con <code>&lt;/style&gt;</code>. Las reglas CSS van entre esas dos etiquetas; los títulos y párrafos quedan fuera. El laboratorio ya prepara html, head y body para ti. No necesitas un archivo CSS ni un enlace link todavía. Una regla CSS responde tres preguntas: <strong>¿a quién?</strong> (selector), <strong>¿qué cambio?</strong> (propiedad) y <strong>¿cómo?</strong> (valor). <code>h1 { color: purple; }</code> se lee: «al título, cámbiale el color a morado». Es como pintar tu cuarto: eliges la pared, decides que vas a cambiar el color y escoges cuál.',
                video: { title: 'Curso básico de CSS – 2. Selectores', youtubeId: 'uqkj7HQ7ids' },
                baseHTML: cssStarter,
                missions: [
                    cssMission('m1', 'Pinta el título',
                        'Primero escribe <code>&lt;style&gt;</code> y <code>&lt;/style&gt;</code> debajo de <code>&lt;/main&gt;</code>. Entre ambas etiquetas escribe una regla para <span class="tag-badge">h1</span> con la propiedad <span class="tag-badge">color</span>.',
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
                    cssMission('m3', 'Elige un fondo que se lea bien',
                        'Dale un color de fondo a toda la página con <span class="tag-badge">body</span>. Comprueba que tu texto se siga leyendo.',
                        [
                            '<code>body</code> es toda la página y la propiedad del fondo es <code>background-color</code>. Si tu letra es oscura, elige un fondo claro; si tu letra es clara, un fondo oscuro. A eso se le llama <strong>contraste</strong>.',
                            'Ejemplo: <code>body { background-color: lightyellow; }</code>'
                        ],
                        'body', 'background')
                ]
            },
            {
                id: 'tipografia',
                understanding: ["¿Qué diferencia hay entre font-size y line-height? Muestra un cambio de cada propiedad.", "Una compañera escribió font-size: 18 px. Corrige la separación entre el número y la unidad.", "Prueba otra familia de letra con respaldo y explica cuál se lee mejor. Conserva tamaños cómodos."],
                title: 'Letras con personalidad',
                description: 'Elige la letra, el tamaño y el espacio entre líneas para que tu página se lea mejor.',
                minutes: 15,
                learn: ['font-family', 'font-size', 'line-height', 'text-align'],
                idea: 'Un texto se lee mejor cuando la letra es clara, el tamaño es suficiente y las líneas no están pegadas. En <code>font-family</code> escribes primero la letra que quieres y al final una de respaldo (<code>sans-serif</code>), por si la computadora no tiene la primera.',
                baseHTML: cssStarter,
                missions: [
                    cssMission('m1', 'Elige una letra',
                        'Usa <span class="tag-badge">font-family</span> en <span class="tag-badge">body</span> para cambiar la letra de toda la página.',
                        [
                            'Letras que funcionan en casi todas las computadoras: <code>Verdana</code>, <code>Georgia</code>, <code>Arial</code>, <code>Tahoma</code>. Al final agrega <code>sans-serif</code> o <code>serif</code>.',
                            'Ejemplo: <code>body { font-family: Verdana, sans-serif; }</code>'
                        ],
                        'body', 'font-family'),
                    cssMission('m2', 'Agranda los párrafos',
                        'Cambia el tamaño de la letra de los párrafos con <span class="tag-badge">font-size</span>.',
                        [
                            'Los tamaños se escriben en <code>px</code>. El tamaño normal es <code>16px</code>; para leer cómodo, usa entre <code>16px</code> y <code>20px</code>.',
                            'Ejemplo: <code>p { font-size: 18px; }</code>'
                        ],
                        'p', 'font-size'),
                    {
                        id: 'm3',
                        title: 'Separa las líneas',
                        desc: 'Usa <span class="tag-badge">line-height</span> en <span class="tag-badge">body</span> o en <span class="tag-badge">p</span> para dejar aire entre las líneas.',
                        hints: [
                            'Un valor entre <code>1.4</code> y <code>1.8</code>, sin <code>px</code>, hace que el texto se lea mejor.',
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
                understanding: ["Relaciona class=\"tarjeta\" en HTML con .tarjeta en CSS. ¿Dónde va el punto? Señala padding y margin en la vista previa.", "Si HTML dice class=\"tarjeta\" y CSS dice tarjeta { border: 2px solid blue; }, ¿qué falta? Corrige la regla en tu cuaderno.", "En una copia descargada, cambia tarjeta por ficha tanto en HTML como en CSS. Explica por qué deben coincidir. Conserva tarjeta en el laboratorio para sus comprobaciones."],
                title: 'Cajas y espacios',
                description: 'Aprende a poner una clase en HTML, seleccionarla desde CSS y agregar borde y espacios.',
                minutes: 20,
                learn: ['border', 'border-radius', 'padding', 'margin', 'box-shadow'],
                idea: 'Primero localiza <code>&lt;article&gt;</code> en el HTML: agrupa el título y el texto de tu tarjeta (un div también puede agrupar contenido). Escribe <code>&lt;article class="tarjeta"&gt;</code>; class es un atributo y tarjeta es el nombre que elegimos. En CSS se selecciona con un punto: <code>.tarjeta</code>. HTML lleva <code>class="tarjeta"</code>, sin punto; CSS lleva <code>.tarjeta { … }</code>, dentro de style. Solo los elementos con esa clase reciben la regla. En CSS todo es una caja. Piensa en una foto enmarcada colgada en la pared: la foto es el <strong>contenido</strong>, el espacio blanco entre la foto y el marco es el <strong>padding</strong>, el marco es el <strong>border</strong> y la distancia hasta el siguiente cuadro es el <strong>margin</strong>.',
                video: { title: 'Curso básico de CSS – 5. Modelo de caja', youtubeId: 'SKkKLi1wAos' },
                baseHTML: cssStarter,
                missions: [
                    cssMission('m1', 'Conecta la clase y dibuja el borde',
                        'En HTML cambia <code>&lt;article&gt;</code> por <code>&lt;article class="tarjeta"&gt;</code>. Dentro de style, agrega un borde a <span class="tag-badge">.tarjeta</span> con grosor, estilo y color.',
                        [
                            'El punto de <code>.tarjeta</code> indica una clase: en el HTML aparece como <code>class="tarjeta"</code>. El borde necesita tres datos: grosor (<code>2px</code>), estilo (<code>solid</code>) y color.',
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
                            '<code>padding</code> es el espacio entre el borde y el contenido, como el espacio blanco entre la foto y el marco.',
                            'Ejemplo: <code>.tarjeta { padding: 16px; }</code>'
                        ],
                        '.tarjeta', 'padding'),
                    cssMission('m4', 'Dale espacio por fuera',
                        'Usa <span class="tag-badge">margin</span> para separar la tarjeta del resto de la página.',
                        [
                            '<code>margin</code> es el espacio fuera del borde, como la distancia entre un cuadro y otro.',
                            'Ejemplo: <code>.tarjeta { margin: 24px; }</code>'
                        ],
                        '.tarjeta', 'margin'),
                    cssMission('m5', 'Agrega una sombra',
                        'Haz que la tarjeta destaque con <span class="tag-badge">box-shadow</span>.',
                        [
                            'La sombra lleva cuatro datos: movimiento horizontal, movimiento vertical, desenfoque y color.',
                            'Ejemplo: <code>.tarjeta { box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); }</code>'
                        ],
                        '.tarjeta', 'box-shadow')
                ]
            },
            {
                id: 'interaccion-responsive',
                understanding: ["Explica cuándo se activan :hover, :focus-visible y @media. Demuestra uno de los tres.", "Compara a :hover con a:hover. El espacio selecciona descendientes; escribe la forma que selecciona el propio enlace.", "Prueba el botón con Tab y una ventana angosta. Describe una dificultad que encontraste y cómo la corregiste."],
                title: 'Botones vivos y celular',
                challenge: true,
                description: 'Reto: haz que el botón y el enlace reaccionen, y que la tarjeta se vea bien en el celular.',
                minutes: 20,
                learn: [':hover', '@media', ':focus-visible'],
                idea: 'Algunas reglas solo se aplican en ciertos momentos. <code>:hover</code> se aplica cuando el cursor está encima; <code>:focus-visible</code>, cuando eliges algo con la tecla Tab; y <code>@media</code>, solo cuando la pantalla es pequeña, como la de un celular.',
                video: { title: 'Pseudoclases hover y focus en CSS', youtubeId: 'i_N-9NRnjNI' },
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
                        desc: 'Crea una regla <span class="tag-badge">:hover</span> para el enlace <strong>o</strong> para el botón, que cambie su color al pasar el cursor.',
                        hints: [
                            '<code>:hover</code> solo se aplica cuando el cursor está encima del elemento. Se escribe pegado, sin espacio: <code>a:hover</code>.',
                            'Ejemplo: <code>a:hover { color: crimson; }</code> o <code>button:hover { background-color: #047857; }</code>'
                        ],
                        validate: doc => hasStyle(doc, 'a:hover', ['color', 'background'])
                            || hasStyle(doc, 'button:hover', ['color', 'background'])
                    },
                    {
                        id: 'm3',
                        title: 'Adapta la tarjeta al celular',
                        desc: 'Agrega una regla <span class="tag-badge">@media</span> que incluya un estilo para <span class="tag-badge">.tarjeta</span>.',
                        hints: [
                            '<code>@media</code> aplica sus reglas solo en pantallas pequeñas. Dentro de sus llaves van reglas normales. Para ver el efecto, achica la ventana del navegador hasta que sea angosta como un celular.',
                            'Ejemplo: <code>@media (max-width: 600px) { .tarjeta { margin: 8px; } }</code>'
                        ],
                        video: { title: 'Aprende media queries en CSS', youtubeId: 'yneuaVjotO8' },
                        validate: doc => hasStyle(doc, '.tarjeta', '*', { inMedia: true })
                    },
                    cssMission('m4', 'Muestra el foco del teclado',
                        'Usa <span class="tag-badge">button:focus-visible</span> con <span class="tag-badge">outline</span> para que el botón se note al navegar con Tab.',
                        [
                            'Haz clic en la vista previa y pulsa Tab: <code>:focus-visible</code> marca el botón elegido con el teclado. Esto ayuda a quienes no usan mouse.',
                            'Ejemplo: <code>button:focus-visible { outline: 3px solid orange; }</code>'
                        ],
                        'button:focus-visible', 'outline')
                ]
            }
        ]
    });
})();
