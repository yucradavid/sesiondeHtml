window.SessionRegistry.register({
    id: 'sesion1',
    title: 'Sesión 1: Proyectos con HTML',
    projects: [
        {
            id: 'primera-pagina',
            title: '1. Mi primera página (fácil)',
            description: 'Presenta quién eres usando títulos y párrafos.',
            baseHTML: '<!-- Proyecto 1: Mi primera página -->\n<h1>Mi primera página</h1>\n<p>Escribe aquí tu nombre y una presentación corta.</p>\n\n',
            missions: [
                {
                    id: 'm1',
                    title: 'Ponle un título',
                    desc: 'Personaliza el <span class="tag-badge">&lt;h1&gt;</span> con el nombre de tu página.',
                    validate: doc => {
                        const heading = doc.querySelector('h1');
                        return Boolean(heading && heading.textContent.trim() && heading.textContent.trim() !== 'Mi primera página');
                    }
                },
                {
                    id: 'm2',
                    title: 'Preséntate',
                    desc: 'Escribe una presentación propia dentro de <span class="tag-badge">&lt;p&gt;</span>.',
                    validate: doc => {
                        const paragraph = doc.querySelector('p');
                        return Boolean(paragraph && paragraph.textContent.trim() && paragraph.textContent.trim() !== 'Escribe aquí tu nombre y una presentación corta.');
                    }
                },
                {
                    id: 'm3',
                    title: 'Agrega otra sección',
                    desc: 'Usa <span class="tag-badge">&lt;h2&gt;</span> para crear una segunda sección, por ejemplo «Mis gustos».',
                    validate: doc => {
                        const heading = doc.querySelector('h2');
                        return Boolean(heading && heading.textContent.trim());
                    }
                }
            ]
        },
        {
            id: 'portada',
            title: '2. Portada de película o libro',
            description: 'Crea una portada atractiva para una historia que te guste.',
            baseHTML: '<!-- Proyecto 2: Portada de libro o película -->\n<main>\n  <h1>El viaje increíble</h1>\n  <p>Una historia sobre la aventura y la amistad.</p>\n  <img src="https://placehold.co/480x280?text=Mi+portada" alt="Imagen de la portada">\n</main>\n',
            missions: [
                {
                    id: 'm1',
                    title: 'Elige tu historia',
                    desc: 'Cambia el <span class="tag-badge">&lt;h1&gt;</span> por el título de un libro o película.',
                    validate: doc => {
                        const heading = doc.querySelector('h1');
                        return Boolean(heading && heading.textContent.trim() && heading.textContent.trim() !== 'El viaje increíble');
                    }
                },
                {
                    id: 'm2',
                    title: 'Escribe una sinopsis',
                    desc: 'Resume la historia en un <span class="tag-badge">&lt;p&gt;</span> con tus propias palabras.',
                    validate: doc => {
                        const paragraph = doc.querySelector('p');
                        return Boolean(paragraph && paragraph.textContent.trim() && paragraph.textContent.trim() !== 'Una historia sobre la aventura y la amistad.');
                    }
                },
                {
                    id: 'm3',
                    title: 'Diseña una imagen',
                    desc: 'Cambia la dirección de <span class="tag-badge">src</span> por una imagen que represente tu historia y escribe un <span class="tag-badge">alt</span> descriptivo.',
                    validate: doc => {
                        const image = doc.querySelector('img');
                        return Boolean(
                            image &&
                            image.getAttribute('src') &&
                            !image.getAttribute('src').includes('placehold.co') &&
                            image.getAttribute('alt')?.trim()
                        );
                    }
                },
                {
                    id: 'm4',
                    title: 'Añade los créditos',
                    desc: 'Incluye otro <span class="tag-badge">&lt;p&gt;</span> con el autor, director o año.',
                    validate: doc => {
                        const credit = doc.querySelectorAll('main > p')[1];
                        return Boolean(credit && credit.textContent.trim());
                    }
                }
            ]
        },
        {
            id: 'tarea-escolar',
            title: '3. Mi tarea escolar',
            description: 'Ordena una tarea con secciones, lista y una fuente consultada.',
            baseHTML: '<!-- Proyecto 3: Mi tarea escolar -->\n<main>\n  <h1>Los planetas</h1>\n  <p>Escribe una introducción al tema de tu tarea.</p>\n  <h2>Ideas principales</h2>\n  <ul>\n    <li>Primera idea</li>\n    <li>Segunda idea</li>\n  </ul>\n  <a href="https://es.wikipedia.org/">Fuente para consultar</a>\n</main>\n',
            missions: [
                {
                    id: 'm1',
                    title: 'Define el tema',
                    desc: 'Cambia <span class="tag-badge">&lt;h1&gt;</span> por el tema real de tu tarea.',
                    validate: doc => {
                        const heading = doc.querySelector('h1');
                        return Boolean(heading && heading.textContent.trim() && heading.textContent.trim() !== 'Los planetas');
                    }
                },
                {
                    id: 'm2',
                    title: 'Escribe la introducción',
                    desc: 'Redacta una introducción propia dentro de <span class="tag-badge">&lt;p&gt;</span>.',
                    validate: doc => {
                        const paragraph = doc.querySelector('p');
                        return Boolean(paragraph && paragraph.textContent.trim() && paragraph.textContent.trim() !== 'Escribe una introducción al tema de tu tarea.');
                    }
                },
                {
                    id: 'm3',
                    title: 'Organiza tus secciones',
                    desc: 'Crea un subtítulo <span class="tag-badge">&lt;h2&gt;</span> y una lista <span class="tag-badge">&lt;ul&gt;</span> con al menos tres ideas.',
                    validate: doc => Boolean(doc.querySelector('h2') && doc.querySelectorAll('ul li').length >= 3)
                },
                {
                    id: 'm4',
                    title: 'Cita una fuente',
                    desc: 'Cambia el <span class="tag-badge">href</span> del enlace por la página que consultaste.',
                    validate: doc => {
                        const link = doc.querySelector('a[href]');
                        return Boolean(link && link.getAttribute('href') && link.getAttribute('href') !== 'https://es.wikipedia.org/');
                    }
                },
                {
                    id: 'm5',
                    title: 'Cierra con una conclusión',
                    desc: 'Añade un último párrafo con lo que aprendiste.',
                    validate: doc => {
                        const paragraphs = [...doc.querySelectorAll('p')];
                        return paragraphs.length >= 2 && paragraphs.some(paragraph =>
                            paragraph.textContent.trim() !== 'Escribe una introducción al tema de tu tarea.'
                        );
                    }
                }
            ]
        },
        {
            id: 'cv',
            title: '4. Mi currículum (reto)',
            description: 'Presenta tu perfil, habilidades, experiencia y contacto.',
            baseHTML: '<!-- Proyecto 4: Mi currículum -->\n<main>\n  <header>\n    <h1>Tu nombre</h1>\n    <p>Estudiante | Mi ciudad</p>\n  </header>\n  <section>\n    <h2>Sobre mí</h2>\n    <p>Escribe un resumen profesional breve.</p>\n  </section>\n  <section>\n    <h2>Habilidades</h2>\n    <ul>\n      <li>Comunicación</li>\n      <li>Trabajo en equipo</li>\n    </ul>\n  </section>\n  <section>\n    <h2>Experiencia o proyectos</h2>\n    <p>Describe un proyecto o experiencia.</p>\n  </section>\n  <footer><a href="mailto:tu-correo@ejemplo.com">Contactarme</a></footer>\n</main>\n',
            missions: [
                {
                    id: 'm1',
                    title: 'Identifica tu perfil',
                    desc: 'Escribe tu nombre real o de práctica y perfil en <span class="tag-badge">&lt;h1&gt;</span>.',
                    validate: doc => {
                        const heading = doc.querySelector('h1');
                        return Boolean(heading && heading.textContent.trim() && heading.textContent.trim() !== 'Tu nombre');
                    }
                },
                {
                    id: 'm2',
                    title: 'Escribe tu resumen',
                    desc: 'Personaliza el resumen de la sección «Sobre mí».',
                    validate: doc => {
                        const summary = doc.querySelector('section:nth-of-type(1) p');
                        return Boolean(summary && summary.textContent.trim() !== 'Escribe un resumen profesional breve.');
                    }
                },
                {
                    id: 'm3',
                    title: 'Enumera tus habilidades',
                    desc: 'Añade al menos tres habilidades a tu lista.',
                    validate: doc => doc.querySelectorAll('section ul li').length >= 3
                },
                {
                    id: 'm4',
                    title: 'Agrega un proyecto',
                    desc: 'Describe un proyecto propio en «Experiencia o proyectos».',
                    validate: doc => {
                        const project = doc.querySelector('section:nth-of-type(3) p');
                        return Boolean(project && project.textContent.trim() !== 'Describe un proyecto o experiencia.');
                    }
                },
                {
                    id: 'm5',
                    title: 'Incluye una forma de contacto',
                    desc: 'Cambia el enlace <span class="tag-badge">mailto:</span> por un correo de práctica.',
                    validate: doc => {
                        const link = doc.querySelector('a[href^="mailto:"]');
                        return Boolean(link && link.getAttribute('href') !== 'mailto:tu-correo@ejemplo.com');
                    }
                }
            ]
        }
    ]
});
