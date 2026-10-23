(function () {
    const { hasOwnText, countWithText } = window.MissionChecks;

    window.SessionRegistry.register({
        id: 'sesion1',
        number: 1,
        title: 'Sesión 1: Mi primera página web',
        area: 'HTML',
        minutes: 90,
        purpose: 'crear una página web con títulos, párrafos, imágenes, listas y enlaces.',
        product: 'Tu página personal, descargada como archivo .html con el botón «Descargar».',
        vocabulary: ['etiqueta', 'atributo', 'título', 'párrafo', 'imagen', 'lista', 'enlace'],
        criteria: [
            'Uso <h1> y <p> con texto escrito por mí.',
            'Agrego una imagen con su texto alternativo (alt).',
            'Ordeno mis ideas en una lista.',
            'Cito la fuente que consulté con un enlace.'
        ],
        start: '¿Qué tienen en común todas las páginas web que visitas? Piensa en sus títulos, textos e imágenes.',
        closing: [
            '¿Qué etiqueta usaste más hoy y para qué sirve?',
            '¿Por qué es importante escribir un alt en cada imagen?',
            '¿Qué le agregarías a tu página en la próxima clase?'
        ],
        projects: [
            {
                id: 'primera-pagina',
                title: '¡Hola, soy yo!',
                description: 'Preséntate con un título, un párrafo y una sección sobre tus gustos.',
                minutes: 15,
                learn: ['<h1>', '<p>', '<h2>'],
                baseHTML: '<!-- Subsesión 1.1: ¡Hola, soy yo! -->\n<h1>Mi primera página</h1>\n<p>Escribe aquí tu nombre y una presentación corta.</p>\n\n',
                missions: [
                    {
                        id: 'm1',
                        title: 'Escribe tu nombre como título',
                        desc: 'Cambia el texto que está dentro de <span class="tag-badge">&lt;h1&gt;</span> por tu nombre o el nombre de tu página.',
                        hints: [
                            '<code>&lt;h1&gt;</code> es el título más grande de la página. Solo cambia el texto que está entre <code>&lt;h1&gt;</code> y <code>&lt;/h1&gt;</code>.',
                            'Ejemplo: <code>&lt;h1&gt;Hola, soy Ana&lt;/h1&gt;</code>'
                        ],
                        validate: doc => hasOwnText(doc.querySelector('h1'), 'Mi primera página')
                    },
                    {
                        id: 'm2',
                        title: 'Preséntate en un párrafo',
                        desc: 'Escribe dentro de <span class="tag-badge">&lt;p&gt;</span> quién eres, con tus propias palabras.',
                        hints: [
                            'El párrafo <code>&lt;p&gt;</code> sirve para escribir texto normal, como en tu cuaderno.',
                            'Ejemplo: <code>&lt;p&gt;Estoy en segundo de secundaria y me gusta dibujar.&lt;/p&gt;</code>'
                        ],
                        validate: doc => hasOwnText(doc.querySelector('p'), 'Escribe aquí tu nombre y una presentación corta.')
                    },
                    {
                        id: 'm3',
                        title: 'Crea la sección «Mis gustos»',
                        desc: 'Agrega un subtítulo <span class="tag-badge">&lt;h2&gt;</span> y, debajo, un nuevo <span class="tag-badge">&lt;p&gt;</span> que cuente lo que te gusta.',
                        hints: [
                            '<code>&lt;h2&gt;</code> es un subtítulo: se ve más pequeño que <code>&lt;h1&gt;</code>. Escríbelo debajo de tu párrafo.',
                            'Ejemplo:<br><code>&lt;h2&gt;Mis gustos&lt;/h2&gt;</code><br><code>&lt;p&gt;Me gusta el fútbol y la música.&lt;/p&gt;</code>'
                        ],
                        validate: doc => hasOwnText(doc.querySelector('h2')) && countWithText(doc.querySelectorAll('p')) >= 2
                    }
                ]
            },
            {
                id: 'portada',
                title: 'Mi libro o película favorita',
                description: 'Diseña la portada de una historia que te guste: título, resumen, imagen y créditos.',
                minutes: 20,
                learn: ['<img>', 'src', 'alt'],
                baseHTML: '<!-- Subsesión 1.2: Mi libro o película favorita -->\n<main>\n  <h1>El viaje increíble</h1>\n  <p>Una historia sobre la aventura y la amistad.</p>\n  <img src="https://placehold.co/480x280?text=Mi+portada" alt="Imagen de la portada">\n</main>\n',
                missions: [
                    {
                        id: 'm1',
                        title: 'Elige tu historia',
                        desc: 'Cambia el <span class="tag-badge">&lt;h1&gt;</span> por el título de tu libro o película favorita.',
                        hints: [
                            'Puede ser un libro del plan lector, una película o una serie que te guste.',
                            'Ejemplo: <code>&lt;h1&gt;El principito&lt;/h1&gt;</code>'
                        ],
                        validate: doc => hasOwnText(doc.querySelector('h1'), 'El viaje increíble')
                    },
                    {
                        id: 'm2',
                        title: 'Escribe el resumen',
                        desc: 'Cuenta de qué trata la historia en el primer <span class="tag-badge">&lt;p&gt;</span>, con tus palabras.',
                        hints: [
                            'Responde en una o dos oraciones: ¿quién es el personaje principal y qué le pasa?',
                            'Ejemplo: <code>&lt;p&gt;Un niño viaja por varios planetas y aprende el valor de la amistad.&lt;/p&gt;</code>'
                        ],
                        validate: doc => hasOwnText(doc.querySelector('p'), 'Una historia sobre la aventura y la amistad.')
                    },
                    {
                        id: 'm3',
                        title: 'Pon tu imagen y descríbela',
                        desc: 'Cambia <span class="tag-badge">src</span> por la dirección de una imagen de tu historia y escribe en <span class="tag-badge">alt</span> qué se ve en ella.',
                        hints: [
                            '<code>src</code> es la dirección de la imagen. Busca una imagen, haz clic derecho sobre ella y elige «Copiar dirección de imagen».',
                            '<code>alt</code> describe la imagen para quien no puede verla. Ejemplo: <code>alt="Un niño de pie sobre un planeta pequeño"</code>'
                        ],
                        validate: doc => {
                            const image = doc.querySelector('img');
                            const src = image?.getAttribute('src')?.trim() || '';
                            const alt = image?.getAttribute('alt')?.trim() || '';
                            return Boolean(src && !src.includes('placehold.co') && alt && alt !== 'Imagen de la portada');
                        }
                    },
                    {
                        id: 'm4',
                        title: 'Agrega los créditos',
                        desc: 'Escribe otro <span class="tag-badge">&lt;p&gt;</span> debajo de la imagen con el autor o director y el año.',
                        hints: [
                            'Escribe el nuevo párrafo después de <code>&lt;img&gt;</code> y antes de <code>&lt;/main&gt;</code>.',
                            'Ejemplo: <code>&lt;p&gt;Autor: Antoine de Saint-Exupéry, 1943&lt;/p&gt;</code>'
                        ],
                        validate: doc => countWithText(doc.querySelectorAll('main > p')) >= 2
                    }
                ]
            },
            {
                id: 'tarea-escolar',
                title: 'Mi tarea del colegio',
                description: 'Ordena una tarea de cualquier curso con introducción, ideas principales, fuente y conclusión.',
                minutes: 20,
                learn: ['<ul>', '<li>', '<a href>'],
                baseHTML: '<!-- Subsesión 1.3: Mi tarea del colegio -->\n<main>\n  <h1>Los planetas</h1>\n  <p>Escribe una introducción al tema de tu tarea.</p>\n  <h2>Ideas principales</h2>\n  <ul>\n    <li>Primera idea</li>\n    <li>Segunda idea</li>\n  </ul>\n  <a href="https://es.wikipedia.org/">Fuente para consultar</a>\n</main>\n',
                missions: [
                    {
                        id: 'm1',
                        title: 'Escribe el tema',
                        desc: 'Cambia el <span class="tag-badge">&lt;h1&gt;</span> por el tema de tu tarea. Puede ser de cualquier curso.',
                        hints: [
                            'Elige un tema que estés estudiando: Ciencia, Historia, Comunicación, Arte…',
                            'Ejemplo: <code>&lt;h1&gt;El ciclo del agua&lt;/h1&gt;</code>'
                        ],
                        validate: doc => hasOwnText(doc.querySelector('h1'), 'Los planetas')
                    },
                    {
                        id: 'm2',
                        title: 'Redacta la introducción',
                        desc: 'Escribe en el primer <span class="tag-badge">&lt;p&gt;</span> de qué trata tu tarea.',
                        hints: [
                            'Dos o tres oraciones bastan: ¿qué es el tema y por qué es importante?',
                            'Ejemplo: <code>&lt;p&gt;El ciclo del agua explica cómo el agua viaja entre el mar, el cielo y la tierra.&lt;/p&gt;</code>'
                        ],
                        validate: doc => hasOwnText(doc.querySelector('p'), 'Escribe una introducción al tema de tu tarea.')
                    },
                    {
                        id: 'm3',
                        title: 'Haz una lista de ideas',
                        desc: 'Escribe tres ideas principales, cada una en un <span class="tag-badge">&lt;li&gt;</span> dentro de <span class="tag-badge">&lt;ul&gt;</span>.',
                        hints: [
                            'Cada <code>&lt;li&gt;</code> es un punto de la lista. Copia una línea <code>&lt;li&gt;…&lt;/li&gt;</code> para agregar otra y reemplaza los textos de ejemplo.',
                            'Ejemplo: <code>&lt;li&gt;El agua se evapora con el calor del sol.&lt;/li&gt;</code>'
                        ],
                        validate: doc => hasOwnText(doc.querySelector('h2'))
                            && countWithText(doc.querySelectorAll('ul li'), 'Primera idea', 'Segunda idea') >= 3
                    },
                    {
                        id: 'm4',
                        title: 'Cita tu fuente',
                        desc: 'Cambia el <span class="tag-badge">href</span> del enlace por la página que consultaste. Debe empezar con <span class="tag-badge">https://</span>.',
                        hints: [
                            '<code>href</code> es la dirección a la que lleva el enlace. Cópiala de la barra de direcciones del navegador.',
                            'Cambia también el texto: <code>&lt;a href="https://…"&gt;Nombre de la página&lt;/a&gt;</code>'
                        ],
                        validate: doc => {
                            const href = doc.querySelector('a[href]')?.getAttribute('href')?.trim() || '';
                            return /^https?:\/\/[^\s/]+\.[^\s]+/i.test(href) && href !== 'https://es.wikipedia.org/';
                        }
                    },
                    {
                        id: 'm5',
                        title: 'Escribe tu conclusión',
                        desc: 'Agrega un último <span class="tag-badge">&lt;p&gt;</span>, después de la lista, con lo que aprendiste.',
                        hints: [
                            'La conclusión responde: ¿qué aprendí con esta tarea?',
                            'Ejemplo: <code>&lt;p&gt;Aprendí que el agua de la Tierra siempre se recicla.&lt;/p&gt;</code>'
                        ],
                        validate: doc => countWithText(doc.querySelectorAll('ul ~ p')) >= 1
                    }
                ]
            },
            {
                id: 'cv',
                title: 'Mi perfil de estudiante',
                challenge: true,
                description: 'Reto: organiza tu perfil en partes, con encabezado, secciones y pie de página.',
                minutes: 15,
                learn: ['<header>', '<section>', '<footer>'],
                baseHTML: '<!-- Subsesión 1.4 (reto): Mi perfil de estudiante -->\n<main>\n  <header>\n    <h1>Tu nombre</h1>\n    <p>Estudiante | Mi colegio</p>\n  </header>\n  <section>\n    <h2>Sobre mí</h2>\n    <p>Escribe quién eres y qué te gusta aprender.</p>\n  </section>\n  <section>\n    <h2>Lo que hago bien</h2>\n    <ul>\n      <li>Comunicación</li>\n      <li>Trabajo en equipo</li>\n    </ul>\n  </section>\n  <section>\n    <h2>Mis proyectos del colegio</h2>\n    <p>Describe un proyecto o trabajo que te haya gustado.</p>\n  </section>\n  <footer><a href="mailto:tu-correo@ejemplo.com">Contactarme</a></footer>\n</main>\n',
                missions: [
                    {
                        id: 'm1',
                        title: 'Escribe tu nombre y tu colegio',
                        desc: 'Cambia «Tu nombre» en el <span class="tag-badge">&lt;h1&gt;</span> y escribe tu grado y colegio en el párrafo del <span class="tag-badge">&lt;header&gt;</span>.',
                        hints: [
                            '<code>&lt;header&gt;</code> es el encabezado: la parte de arriba con lo más importante.',
                            'Ejemplo: <code>&lt;p&gt;Estudiante de 2.° de secundaria | Colegio San Martín&lt;/p&gt;</code>'
                        ],
                        validate: doc => hasOwnText(doc.querySelector('h1'), 'Tu nombre')
                            && hasOwnText(doc.querySelector('header p'), 'Estudiante | Mi colegio')
                    },
                    {
                        id: 'm2',
                        title: 'Cuenta quién eres',
                        desc: 'Personaliza el párrafo de la sección «Sobre mí».',
                        hints: [
                            'Cada <code>&lt;section&gt;</code> agrupa un tema. Busca la que tiene el subtítulo «Sobre mí».',
                            'Ejemplo: <code>&lt;p&gt;Me gusta aprender cómo funcionan las cosas y ayudar a mis compañeros.&lt;/p&gt;</code>'
                        ],
                        validate: doc => hasOwnText(
                            doc.querySelector('section:nth-of-type(1) p'),
                            'Escribe quién eres y qué te gusta aprender.'
                        )
                    },
                    {
                        id: 'm3',
                        title: 'Lista lo que haces bien',
                        desc: 'Deja al menos tres cosas que haces bien en la lista.',
                        hints: [
                            'Agrega una línea <code>&lt;li&gt;…&lt;/li&gt;</code> por cada habilidad.',
                            'Ejemplo: <code>&lt;li&gt;Explicar temas a mis compañeros&lt;/li&gt;</code>'
                        ],
                        validate: doc => countWithText(doc.querySelectorAll('section ul li')) >= 3
                    },
                    {
                        id: 'm4',
                        title: 'Muestra un proyecto',
                        desc: 'Describe un trabajo del colegio en la sección «Mis proyectos del colegio».',
                        hints: [
                            'Cuenta qué hiciste, en qué curso y qué aprendiste.',
                            'Ejemplo: <code>&lt;p&gt;Hice una maqueta del sistema solar para Ciencia y Tecnología.&lt;/p&gt;</code>'
                        ],
                        validate: doc => hasOwnText(
                            doc.querySelector('section:nth-of-type(3) p'),
                            'Describe un proyecto o trabajo que te haya gustado.'
                        )
                    },
                    {
                        id: 'm5',
                        title: 'Agrega un contacto de práctica',
                        desc: 'Cambia el enlace <span class="tag-badge">mailto:</span> por un correo de práctica. No uses tu correo real.',
                        hints: [
                            '<code>&lt;footer&gt;</code> es el pie de página. <code>mailto:</code> hace que el enlace abra un correo nuevo.',
                            'Ejemplo: <code>&lt;a href="mailto:ana.practica@ejemplo.com"&gt;Escríbeme&lt;/a&gt;</code>'
                        ],
                        validate: doc => {
                            const href = doc.querySelector('a[href^="mailto:"]')?.getAttribute('href') || '';
                            return href.includes('@') && href !== 'mailto:tu-correo@ejemplo.com';
                        }
                    }
                ]
            }
        ]
    });
})();
