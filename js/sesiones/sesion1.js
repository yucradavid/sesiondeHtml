(function () {
    const { textOf, hasOwnText, countWithText } = window.MissionChecks;
    const GENERIC_ALTS = ['imagen', 'foto', 'image', 'img', 'picture', 'portada'];

    window.SessionRegistry.register({
        id: 'sesion1',
        number: 1,
        title: 'Sesión 1: Mi primera página web',
        area: 'HTML',
        minutes: 90,
        competency: {
            name: 'Se desenvuelve en entornos virtuales generados por las TIC (CNEB, competencia transversal).',
            capacity: 'Crea objetos virtuales en diversos formatos.'
        },
        purpose: 'crear una página web con títulos, párrafos, imágenes, listas y enlaces.',
        product: 'Tus páginas de las subsesiones 1.1, 1.2 y 1.3, descargadas con el botón «Descargar». Cada subsesión es una página distinta. En el cierre presentas la que más te guste.',
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
                understanding: ["Señala la apertura, el contenido y el cierre de tu h1. ¿En qué se diferencia de un párrafo?", "Observa este código: <h1>Mi presentación</h2>. Explica el error y escribe el cierre correcto en tu cuaderno.", "Sin mirar el modelo, agrega un h2 y un párrafo sobre algo que quieras aprender. Explica qué escribiste."],
                title: '¡Hola, soy yo!',
                description: 'Preséntate con un título, un párrafo y una sección sobre tus gustos.',
                minutes: 15,
                learn: ['<h1>', '<p>', '<h2>'],
                idea: 'Una etiqueta es como una caja con nombre. Se abre con <code>&lt;p&gt;</code> y se cierra con <code>&lt;/p&gt;</code>; lo que escribes en medio es lo que se ve en la página. <code>&lt;h1&gt;</code> es el título más grande, <code>&lt;h2&gt;</code> un subtítulo y <code>&lt;p&gt;</code> un párrafo, como en tu cuaderno.',
                video: { title: 'Qué es HTML: primeros pasos', youtubeId: 'pDla5cvhNas', start: 19, end: 345, note: 'de 0:19 a 5:45' },
                exampleHTML: "<h1>Hola, soy Ana</h1>\n<p>Me gusta aprender y dibujar.</p>\n<h2>Mis gustos</h2>\n<p>Disfruto la música y el fútbol.</p>",
                baseHTML: '',
                missions: [
                    {
                        id: 'm1',
                        title: 'Escribe tu nombre como título',
                        desc: 'Escribe la etiqueta de apertura y cierre de <span class="tag-badge">&lt;h1&gt;</span> y coloca dentro tu primer nombre o el nombre de tu página.',
                        hints: [
                            '<code>&lt;h1&gt;</code> es el título más grande de la página. Escribe el texto entre <code>&lt;h1&gt;</code> y <code>&lt;/h1&gt;</code>.',
                            'Ejemplo: <code>&lt;h1&gt;Hola, soy Ana&lt;/h1&gt;</code>'
                        ],
                        validate: doc => hasOwnText(doc.querySelector('h1'), 'Mi primera página')
                    },
                    {
                        id: 'm2',
                        title: 'Preséntate en un párrafo',
                        desc: 'Crea un párrafo con <span class="tag-badge">&lt;p&gt;</span> y escribe quién eres, con tus propias palabras.',
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
                understanding: ["¿Qué hace src y qué comunica alt? Describe qué debería leer alguien que no ve tu imagen.", "En <img scr=\"portada.png\" alt=\"Portada de mi historia\"> hay un atributo mal escrito. Identifícalo y corrígelo en tu cuaderno.", "Agrega un párrafo con tu recomendación de la historia y justifícala. Revisa que el alt describa la imagen que realmente elegiste."],
                title: 'Mi libro o película favorita',
                description: 'Diseña la portada de una historia que te guste: título, resumen, imagen y créditos.',
                minutes: 20,
                learn: ['<img>', 'src', 'alt'],
                idea: '<code>&lt;img&gt;</code> es una etiqueta sin cierre: toda su información va en sus <strong>atributos</strong>. <code>src</code> dice <em>dónde está</em> la imagen y <code>alt</code> dice <em>qué hay en ella</em>, para quien no puede verla (por ejemplo, una persona ciega que usa un lector de pantalla) o para cuando la imagen no carga.',
                video: { title: 'Imágenes en HTML5: etiqueta img, src, alt y enlaces', youtubeId: 'DbTnucVRUN0' },
                exampleHTML: "<main>\n  <h1>El principito</h1>\n  <p>Un viajero descubre el valor de la amistad.</p>\n  <img src=\"https://placehold.co/480x280?text=El+principito\" alt=\"Cartel con el título El principito\">\n  <p>Autor: Antoine de Saint-Exupéry, 1943</p>\n</main>",
                baseHTML: '',
                missions: [
                    {
                        id: 'm1',
                        title: 'Elige tu historia',
                        desc: 'Abre <code>&lt;main&gt;</code>, crea un <span class="tag-badge">&lt;h1&gt;</span> con el título de tu libro o película favorita.',
                        hints: [
                            'Puede ser un libro del plan lector, una película o una serie que te guste.',
                            'Ejemplo: <code>&lt;h1&gt;El principito&lt;/h1&gt;</code>'
                        ],
                        validate: doc => hasOwnText(doc.querySelector('h1'), 'El viaje increíble')
                    },
                    {
                        id: 'm2',
                        title: 'Escribe el resumen',
                        desc: 'Crea un párrafo y cuenta de qué trata la historia en un <span class="tag-badge">&lt;p&gt;</span>, con tus palabras.',
                        hints: [
                            'Responde en una o dos oraciones: ¿quién es el personaje principal y qué le pasa?',
                            'Ejemplo: <code>&lt;p&gt;Un niño viaja por varios planetas y aprende el valor de la amistad.&lt;/p&gt;</code>'
                        ],
                        validate: doc => hasOwnText(doc.querySelector('p'), 'Una historia sobre la aventura y la amistad.')
                    },
                    {
                        id: 'm3',
                        title: 'Pon tu imagen y descríbela',
                        desc: 'Escribe una etiqueta <code>&lt;img src="…" alt="…"&gt;</code>. Elige <strong>una</strong> opción y luego escribe en <span class="tag-badge">alt</span> qué se ve en la imagen.<br><strong>Opción A:</strong> usa una dirección de imagen que te dé tu docente o que encuentres; debe empezar con <span class="tag-badge">https://</span>.<br><strong>Opción B:</strong> usa una imagen de placehold.co y escribe después de <span class="tag-badge">text=</span> el nombre de tu historia. Usa <span class="tag-badge">+</span> en lugar de espacios.',
                        hints: [
                            'Para la opción A, haz clic derecho sobre una imagen y elige «Copiar dirección de imagen». Si la imagen no aparece en tu página, esa web no deja usarla: prueba con otra o usa la opción B.',
                            'Opción B: <code>src="https://placehold.co/480x280?text=El+principito"</code>. <code>alt</code> describe la imagen: <code>alt="Un niño de pie sobre un planeta pequeño"</code>.'
                        ],
                        validate: doc => {
                            const image = doc.querySelector('img');
                            const src = image?.getAttribute('src')?.trim() || '';
                            const alt = image?.getAttribute('alt')?.trim() || '';
                            if (!/^https:\/\/\S+$/i.test(src) || !alt || alt === 'Imagen de la portada') return false;
                            if (GENERIC_ALTS.includes(alt.toLowerCase())) return false;
                            try {
                                const url = new URL(src);
                                if (!url.hostname.endsWith('placehold.co')) return true;
                                const text = url.searchParams.get('text')?.trim() || '';
                                return Boolean(text) && text !== 'Mi portada';
                            } catch (error) {
                                return false;
                            }
                        }
                    },
                    {
                        id: 'm4',
                        title: 'Agrega los créditos',
                        desc: 'Escribe otro <span class="tag-badge">&lt;p&gt;</span> <strong>debajo de la imagen</strong> con el autor o director y el año. Cierra el contenedor con <code>&lt;/main&gt;</code>.',
                        hints: [
                            'Escribe el nuevo párrafo después de <code>&lt;img&gt;</code> y antes de <code>&lt;/main&gt;</code>.',
                            'Ejemplo: <code>&lt;p&gt;Autor: Antoine de Saint-Exupéry, 1943&lt;/p&gt;</code>'
                        ],
                        validate: doc => countWithText(doc.querySelectorAll('main img ~ p')) >= 1
                    }
                ]
            },
            {
                id: 'tarea-escolar',
                understanding: ["Explica qué contiene ul, para qué sirve li y qué diferencia hay entre href y el texto de un enlace.", "En <ul><p>Primera idea</p></ul>, el párrafo no es un elemento de lista. Reescríbelo usando la etiqueta adecuada.", "Añade una cuarta idea con tus palabras. Abre tu fuente y explica cómo se relaciona con esa idea."],
                title: 'Mi tarea del colegio',
                description: 'Ordena una tarea de cualquier curso con introducción, ideas principales, fuente y conclusión.',
                minutes: 20,
                learn: ['<ul>', '<li>', '<a href>'],
                idea: '<code>&lt;ul&gt;</code> es la lista completa y cada <code>&lt;li&gt;</code> es un punto de esa lista, como las viñetas de un resumen. <code>&lt;a&gt;</code> es un enlace: <code>href</code> dice a dónde lleva y el texto entre <code>&lt;a&gt;</code> y <code>&lt;/a&gt;</code> es lo que se lee. Citar la fuente es decir de dónde sacaste la información, igual que en un trabajo escrito.',
                video: { title: 'Listas en HTML: cómo usar ul, ol y li correctamente', youtubeId: 'TtaHAg4lQ_M' },
                exampleHTML: "<main>\n  <h1>El ciclo del agua</h1>\n  <p>El agua circula por nuestro planeta.</p>\n  <h2>Ideas principales</h2>\n  <ul>\n    <li>El calor favorece la evaporación.</li>\n    <li>El vapor se condensa.</li>\n    <li>La lluvia devuelve agua al suelo.</li>\n  </ul>\n  <a href=\"https://es.wikipedia.org/wiki/Ciclo_hidrológico\">Fuente: ciclo hidrológico</a>\n  <p>Aprendí que el agua está en movimiento.</p>\n</main>",
                baseHTML: '',
                missions: [
                    {
                        id: 'm1',
                        title: 'Escribe el tema',
                        desc: 'Abre <code>&lt;main&gt;</code>, crea un <span class="tag-badge">&lt;h1&gt;</span> con el tema de tu tarea. Puede ser de cualquier curso.',
                        hints: [
                            'Elige un tema que estés estudiando: Ciencia y Tecnología, Ciencias Sociales, Comunicación, Arte y Cultura…',
                            'Ejemplo: <code>&lt;h1&gt;El ciclo del agua&lt;/h1&gt;</code>'
                        ],
                        validate: doc => hasOwnText(doc.querySelector('h1'), 'Los planetas')
                    },
                    {
                        id: 'm2',
                        title: 'Redacta la introducción',
                        desc: 'Crea un párrafo y escribe en un <span class="tag-badge">&lt;p&gt;</span> de qué trata tu tarea.',
                        hints: [
                            'Dos o tres oraciones bastan: ¿qué es el tema y por qué es importante?',
                            'Ejemplo: <code>&lt;p&gt;El ciclo del agua explica cómo el agua viaja entre el mar, el cielo y la tierra.&lt;/p&gt;</code>'
                        ],
                        validate: doc => hasOwnText(doc.querySelector('p'), 'Escribe una introducción al tema de tu tarea.')
                    },
                    {
                        id: 'm3',
                        title: 'Haz una lista de ideas',
                        desc: 'Crea <code>&lt;h2&gt;Ideas principales&lt;/h2&gt;</code> y una lista <code>&lt;ul&gt;&lt;/ul&gt;</code>. Escribe tres ideas principales, cada una en un <span class="tag-badge">&lt;li&gt;</span> dentro de <span class="tag-badge">&lt;ul&gt;</span>.',
                        hints: [
                            'Cada <code>&lt;li&gt;</code> es un punto de la lista. Copia una línea <code>&lt;li&gt;…&lt;/li&gt;</code> para agregar otra y reemplaza los textos de ejemplo.',
                            'Ejemplo: <code>&lt;li&gt;El agua se evapora con el calor del sol.&lt;/li&gt;</code>'
                        ],
                        validate: doc => countWithText(doc.querySelectorAll('ul li'), 'Primera idea', 'Segunda idea') >= 3
                    },
                    {
                        id: 'm4',
                        title: 'Cita tu fuente',
                        desc: 'Crea un enlace <code>&lt;a href="…"&gt;Nombre de la fuente&lt;/a&gt;</code>. Completa <span class="tag-badge">href</span> con la dirección de la página que consultaste y usa como texto del enlace el nombre de esa página. La dirección debe empezar con <span class="tag-badge">https://</span>.',
                        hints: [
                            '<code>href</code> es la dirección a la que lleva el enlace. Cópiala de la barra de direcciones del navegador.',
                            'Ejemplo: <code>&lt;a href="https://es.wikipedia.org/wiki/Ciclo_hidrológico"&gt;Wikipedia: Ciclo hidrológico&lt;/a&gt;</code>'
                        ],
                        video: { title: 'Imágenes en HTML5: etiqueta img, src, alt y enlaces', youtubeId: 'DbTnucVRUN0', note: 'mira la parte de enlaces' },
                        validate: doc => {
                            const link = doc.querySelector('a[href]');
                            const href = link?.getAttribute('href')?.trim() || '';
                            return /^https:\/\/[^\s/]+\.[^\s]+/i.test(href)
                                && href !== 'https://es.wikipedia.org/'
                                && hasOwnText(link, 'Fuente para consultar');
                        }
                    },
                    {
                        id: 'm5',
                        title: 'Escribe tu conclusión',
                        desc: 'Agrega un último <span class="tag-badge">&lt;p&gt;</span>, después de la lista, con lo que aprendiste. Cierra <code>&lt;/main&gt;</code>.',
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
                understanding: ["¿Qué contenido agrupaste en header, section y footer? Justifica una de tus decisiones.", "Un footer quedó dentro de la última section por olvidar </section>. Dibuja el orden de cierre correcto.", "Agrega una sección con una meta de aprendizaje y explica por qué merece una sección propia."],
                title: 'Mi perfil de estudiante',
                challenge: true,
                description: 'Reto: construye tu perfil desde cero con encabezado, tres secciones y pie de página.',
                minutes: 15,
                learn: ['<header>', '<section>', '<footer>'],
                idea: 'Una página bien hecha se divide en partes, como un periódico. <code>&lt;header&gt;</code> es la parte de arriba con el nombre, cada <code>&lt;section&gt;</code> agrupa un tema y <code>&lt;footer&gt;</code> es el pie de página con el contacto. No cambian cómo se ve la página, pero le dicen al navegador (y a los lectores de pantalla) qué es cada parte.',
                video: { title: 'HTML semántico y etiquetas semánticas: ¿qué significa? ¿para qué sirve?', youtubeId: 'wx92etmlHtc' },
                exampleHTML: "<main>\n  <header><h1>Ana</h1><p>Estudiante de secundaria</p></header>\n  <section><h2>Sobre mí</h2><p>Me gusta investigar.</p></section>\n  <section><h2>Lo que hago bien</h2><ul><li>Dibujar</li><li>Escuchar</li><li>Explicar</li></ul></section>\n  <section><h2>Mis proyectos del colegio</h2><p>Construí una maqueta.</p></section>\n  <footer><a href=\"mailto:ana.practica@ejemplo.com\">Contacto de práctica</a></footer>\n</main>",
                baseHTML: '',
                missions: [
                    {
                        id: 'm1',
                        title: 'Arma el encabezado',
                        desc: 'Crea el <span class="tag-badge">&lt;h1&gt;</span> y el primer <span class="tag-badge">&lt;p&gt;</span> dentro de un <span class="tag-badge">&lt;header&gt;</span>. Usa tu primer nombre.',
                        hints: [
                            'Primero escribe <code>&lt;header&gt;</code>, luego crea el <code>&lt;h1&gt;</code> y <code>&lt;/header&gt;</code> justo después del primer <code>&lt;/p&gt;</code>.',
                            'Ejemplo:<br><code>&lt;header&gt;</code><br><code>&lt;h1&gt;Ana&lt;/h1&gt;</code><br><code>&lt;p&gt;Estudiante de 2.° de secundaria&lt;/p&gt;</code><br><code>&lt;/header&gt;</code>'
                        ],
                        validate: doc => hasOwnText(doc.querySelector('header h1'), 'Tu primer nombre')
                    },
                    {
                        id: 'm2',
                        title: 'Crea la sección «Sobre mí»',
                        desc: 'Crea el subtítulo «Sobre mí» y su párrafo dentro de un <span class="tag-badge">&lt;section&gt;</span>. Escribe el párrafo con tus palabras.',
                        hints: [
                            'Cada <code>&lt;section&gt;</code> agrupa un tema: su subtítulo y todo lo que va debajo.',
                            'Ejemplo:<br><code>&lt;section&gt;</code><br><code>&lt;h2&gt;Sobre mí&lt;/h2&gt;</code><br><code>&lt;p&gt;Me gusta aprender cómo funcionan las cosas.&lt;/p&gt;</code><br><code>&lt;/section&gt;</code>'
                        ],
                        validate: doc => [...doc.querySelectorAll('section')].some(section =>
                            /sobre\s+m[ií]/i.test(textOf(section.querySelector('h2')))
                            && hasOwnText(section.querySelector('p'), 'Escribe quién eres y qué te gusta aprender.')
                        )
                    },
                    {
                        id: 'm3',
                        title: 'Crea la sección «Lo que hago bien»',
                        desc: 'Crea el subtítulo «Lo que hago bien» y su lista en otro <span class="tag-badge">&lt;section&gt;</span>. Escribe al menos tres cosas en la lista.',
                        hints: [
                            'Abre <code>&lt;section&gt;</code> antes del <code>&lt;h2&gt;</code> y ciérralo después de <code>&lt;/ul&gt;</code>. Agrega una línea <code>&lt;li&gt;…&lt;/li&gt;</code> por cada habilidad.',
                            'Ejemplo: <code>&lt;li&gt;Explicar temas a mis compañeros&lt;/li&gt;</code>'
                        ],
                        validate: doc => [...doc.querySelectorAll('section')].some(section =>
                            countWithText(section.querySelectorAll('ul li')) >= 3
                        )
                    },
                    {
                        id: 'm4',
                        title: 'Crea una sección nueva desde cero',
                        desc: 'Escribe tú mismo un tercer <span class="tag-badge">&lt;section&gt;</span> con el subtítulo «Mis proyectos del colegio» y un párrafo sobre un trabajo que te haya gustado.',
                        hints: [
                            'Copia la forma de las otras secciones: <code>&lt;section&gt;</code>, luego <code>&lt;h2&gt;</code>, luego <code>&lt;p&gt;</code> y al final <code>&lt;/section&gt;</code>.',
                            'Ejemplo: <code>&lt;p&gt;Hice una maqueta del sistema solar para Ciencia y Tecnología.&lt;/p&gt;</code>'
                        ],
                        // La sección nueva no puede ser «Sobre mí» ni «Lo que hago bien», que ya venían escritas.
                        validate: doc => {
                            const sections = [...doc.querySelectorAll('section')];
                            return sections.length >= 3 && sections.some(section => {
                                const heading = textOf(section.querySelector('h2'));
                                return heading
                                    && !/sobre\s+m[ií]|lo que hago bien/i.test(heading)
                                    && hasOwnText(section.querySelector('p'));
                            });
                        }
                    },
                    {
                        id: 'm5',
                        title: 'Arma el pie de página',
                        desc: 'Crea el enlace de contacto dentro de un <span class="tag-badge">&lt;footer&gt;</span> y usa un correo <strong>de práctica</strong>. No uses tu correo real.',
                        hints: [
                            '<code>&lt;footer&gt;</code> es el pie de página. <code>mailto:</code> hace que el enlace abra un correo nuevo.',
                            'Ejemplo: <code>&lt;footer&gt;&lt;a href="mailto:ana.practica@ejemplo.com"&gt;Escríbeme&lt;/a&gt;&lt;/footer&gt;</code>'
                        ],
                        validate: doc => {
                            const href = doc.querySelector('footer a[href^="mailto:"]')?.getAttribute('href') || '';
                            return href.includes('@') && href !== 'mailto:tu-correo@ejemplo.com';
                        }
                    }
                ]
            }
        ]
    });
})();
