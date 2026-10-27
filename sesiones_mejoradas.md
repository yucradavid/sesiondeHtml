# Sesiones de Academia Web — versión mejorada

Propuesta de mejora de las sesiones 1 (HTML) y 2 (CSS). Mantiene los **ids internos** de cada subsesión para que no se pierda el progreso guardado.

Cada subsesión trae ahora cuatro apoyos nuevos:

- una **idea clave** con un ejemplo cotidiano,
- un **video de refuerzo**,
- una lista de **errores frecuentes** para el docente,
- y, en la Sesión 1, la **competencia del CNEB** en la ficha.

Los cambios marcados con **🔧 Cambio en la plataforma** ya están programados en `js/sesiones/sesion1.js`, `js/sesiones/sesion2.js` y `js/core/app.js`.

---

## Qué cambió

| # | Cambio | Dónde | En la plataforma |
| --- | --- | --- | --- |
| 1 | Cada subsesión tiene «Idea clave», «Video de refuerzo» y «Errores frecuentes». | Todas | ✅ La idea clave aparece arriba de las misiones. Los errores frecuentes son para el docente y están solo en este documento. |
| 2 | Se agrega una **pista 3: mira el video**, después de las dos pistas actuales. | Todas, menos la 2.2 (ver su sección) | ✅ Programado |
| 3 | El reto 1.4 se rediseña: el estudiante **construye** `<header>`, `<section>` y `<footer>`; ya no vienen escritos. | 1.4 | ✅ Programado |
| 4 | En la 1.2 se acepta una imagen de placehold.co **con su propio texto**, para no depender de buscar imágenes en internet. | 1.2, misión 3 | ✅ Programado |
| 5 | Las instrucciones y las revisiones automáticas ahora piden lo mismo. | 1.2 M4, 1.3 M3, 1.3 M4 | ✅ Programado |
| 6 | El criterio «botón que reacciona» pasa al reto. Entra el criterio de **contraste**. | Ficha de la Sesión 2 | ✅ Se ve en la ficha |
| 7 | La misión de `:hover` acepta el enlace **o** el botón. | 2.4, misión 2 | ✅ Programado |
| 8 | Se quita la clase `pagina`, que no se usaba. | Código inicial de la Sesión 2 | ✅ Programado |
| 9 | Se agrega una lista de cotejo por sesión y un checklist para antes de la clase. | Ambas | Solo en este documento |
| 10 | Se usan los nombres de las áreas del currículo peruano (Ciencia y Tecnología, Ciencias Sociales…). | 1.3 | ✅ Se ve en la pista |
| 11 | La competencia del CNEB aparece en la ficha de cada sesión. | Ambas | ✅ Se ve en la ficha |

---

## Antes de la clase (checklist docente)

- [ ] **Abre cada video de la sesión** y confirma que carga en la red del colegio. Mira el tramo que vas a usar: puede haber anuncios o recomendaciones al final.
- [ ] **Descarga una página de prueba** con el botón «Descargar» y ábrela desde la computadora para confirmar que se ve bien. El archivo descargado ya incluye `<meta charset="utf-8">`, así que las tildes y la «ñ» se ven correctamente.
- [ ] Prepara **2 o 3 direcciones de imágenes** ya probadas para la 1.2, por si la búsqueda en internet se complica.
- [ ] Si cambiaste el código inicial de una subsesión (por ejemplo, el nuevo 1.4), recuerda que **el navegador de cada estudiante guarda el código anterior**. Quien ya abrió esa subsesión seguirá viendo la versión vieja. Para cargar la nueva, debe pulsar **Reiniciar** dentro de esa subsesión (borra su código y sus misiones de esa subsesión, no las demás).
- [ ] Ten a mano la **lista de cotejo** de la sesión (al final de cada sesión).

---

## Cómo usar los videos

Los videos tienen tres usos posibles, de menor a mayor autonomía:

1. **En el inicio, proyectado para todos** (3 a 5 min). Funciona bien en la Sesión 1, cuando nadie ha escrito código todavía.
2. **Como pista 3**, cuando el estudiante ya leyó las dos pistas y sigue sin avanzar. Así el video llega justo cuando se necesita y no reemplaza la práctica.
3. **Para casa o para repasar**, sobre todo el curso completo de freeCodeCamp en español.

**Importante:** encontré estos videos por búsqueda, pero no los vi completos. Revísalos antes de usarlos en clase. Varios son partes de cursos más largos: usa solo el tramo que necesitas. Si la red del colegio bloquea YouTube, proyéctalos desde tu equipo en el inicio y deja las pistas 1 y 2 como apoyo principal.

**Revisión de enlaces (23/10/2026):** se comprobó con YouTube que 13 de los 15 videos existen y que su título y canal coinciden con lo que dice este documento. Dos ya no existen y se quitaron: el de `line-height` de la 2.2 y el alternativo de modelo de caja de la 2.3. Esta revisión confirma que los videos existen, no su contenido.

**Cómo aparecen en la plataforma:** el botón «Necesito una pista» muestra la pista 1, luego la 2 y, en el tercer clic, «Mira el video». El video se ve dentro del panel de misiones (con `youtube-nocookie.com`) y debajo hay un enlace para abrirlo en YouTube y un aviso para pedir ayuda al docente si no carga. Cada subsesión usa su primer video de la lista. Dos misiones tienen un video propio: la 1.3 M4 usa el de enlaces y la 2.4 M3 el de media queries.

---

## Resumen

| Sesión | Área | Subsesiones | Misiones | Duración |
| --- | --- | --- | --- | --- |
| Sesión 1: Mi primera página web | HTML | 4 (1 reto) | 17 | 90 min |
| Sesión 2: Le doy estilo a mi página | CSS | 4 (1 reto) | 16 | 90 min |
| **Total** | | **8** | **33** | |

## Cómo está organizada cada subsesión

| Parte | Para qué sirve | Quién la ve |
| --- | --- | --- |
| **Idea clave** | Explica el concepto en una o dos oraciones, con un ejemplo de la vida diaria. | Estudiante, arriba de las misiones |
| **Misiones** | Pasos cortos que la plataforma revisa sola. | Estudiante |
| **Pistas 1 y 2** | La primera explica la idea; la segunda muestra un ejemplo. | Estudiante, con «Necesito una pista» |
| **Pista 3: video** 🔧 | Video corto que refuerza el tema de la subsesión. | Estudiante, después de la pista 2 |
| **Errores frecuentes** | Lo que más suele fallar, para que el docente lo detecte rápido al pasar por los sitios. | Docente |

---

## Sesión 1: Mi primera página web

**Área:** HTML · **Duración:** 90 minutos · **Subsesiones:** 4 · **Misiones:** 17 · **Archivo:** `js/sesiones/sesion1.js`

### Ficha de la sesión

- **Competencia transversal (CNEB):** Se desenvuelve en entornos virtuales generados por las TIC.
  - **Capacidad:** Crea objetos virtuales en diversos formatos.
  - *Ajusta la competencia y el desempeño a tu programación anual y al grado.*
- **Propósito:** Hoy aprenderé a crear una página web con títulos, párrafos, imágenes, listas y enlaces.
- **Producto final:** Tus páginas de las subsesiones 1.1, 1.2 y 1.3, descargadas con el botón «Descargar». Cada subsesión es una página distinta. En el cierre presentas la que más te guste.
- **Palabras nuevas:** etiqueta, atributo, título, párrafo, imagen, lista, enlace.
- **Lo lograré cuando…**
  - Uso `<h1>` y `<p>` con texto escrito por mí.
  - Agrego una imagen con su texto alternativo (`alt`).
  - Ordeno mis ideas en una lista.
  - Cito la fuente que consulté con un enlace.

### Cómo se desarrolla la clase

| Momento | Tiempo | Qué pasa |
| --- | --- | --- |
| Inicio | 10 min | **Proyecta el video de la 1.1** (de 0:19 a 5:45). Luego plantea la pregunta: «¿Qué tienen en común todas las páginas web que visitas? Piensa en sus títulos, textos e imágenes.» Si hay tiempo, abre cualquier página, haz clic derecho y elige «Ver código fuente» para mostrar que todas están hechas de etiquetas. |
| Desarrollo | 70 min | 1.1 ¡Hola, soy yo! (15 min) → 1.2 Mi libro o película favorita (20 min) → 1.3 Mi tarea del colegio (20 min) → 1.4 Mi perfil de estudiante (15 min, reto) |
| Cierre | 10 min | Preguntas: 1) ¿Qué etiqueta usaste más hoy y para qué sirve? 2) ¿Por qué es importante escribir un `alt` en cada imagen? 3) ¿Qué le agregarías a tu página en la próxima clase? Después, todos descargan su página. |

### Subsesiones

| N.º | Subsesión | Qué hace el estudiante | Aprenderás | Misiones | Tiempo |
| --- | --- | --- | --- | --- | --- |
| 1.1 | ¡Hola, soy yo! | Se presenta con un título, un párrafo y una sección sobre sus gustos. | `<h1>` `<p>` `<h2>` | 3 | 15 min |
| 1.2 | Mi libro o película favorita | Diseña la portada de una historia: título, resumen, imagen y créditos. | `<img>` `src` `alt` | 4 | 20 min |
| 1.3 | Mi tarea del colegio | Ordena una tarea con introducción, ideas principales, fuente y conclusión. | `<ul>` `<li>` `<a href>` | 5 | 20 min |
| 1.4 | Mi perfil de estudiante (reto) | Organiza su perfil construyendo encabezado, secciones y pie de página. | `<header>` `<section>` `<footer>` | 5 | 15 min |

---

### 1.1 · ¡Hola, soy yo!

> Preséntate con un título, un párrafo y una sección sobre tus gustos.

- **Aprenderás:** `<h1>` `<p>` `<h2>`
- **Tiempo:** 15 min · **Tipo:** principal · **Misiones:** 3
- **Id interno:** `primera-pagina` (no cambiarlo)

**💡 Idea clave:** Una etiqueta es como una caja con nombre. Se abre con `<p>` y se cierra con `</p>`; lo que escribes en medio es lo que se ve en la página. `<h1>` es el título más grande, `<h2>` un subtítulo y `<p>` un párrafo, como en tu cuaderno.

**🎬 Video de refuerzo:**

- [Qué es HTML: primeros pasos](https://www.youtube.com/watch?v=pDla5cvhNas&t=19s). Mira de **0:19 a 5:45**: explica qué es HTML y muestra ejemplos. Desde 5:45 enseña a instalar un editor, que en el laboratorio no hace falta.
- Alternativa: [Curso Básico de HTML – 2. Etiquetas para textos](https://www.youtube.com/watch?v=TNQleomUw6U) (títulos, párrafos y otras etiquetas de texto).

**Código inicial:**

```html
<!-- Subsesión 1.1: ¡Hola, soy yo! -->
<h1>Mi primera página</h1>
<p>Escribe aquí tu nombre y una presentación corta.</p>
```

#### Misión 1 · Escribe tu nombre como título

- **Qué hacer:** Cambia el texto que está dentro de `<h1>` por tu primer nombre o el nombre de tu página.
- **Pista 1:** `<h1>` es el título más grande de la página. Solo cambia el texto que está entre `<h1>` y `</h1>`.
- **Pista 2:** Ejemplo: `<h1>Hola, soy Ana</h1>`
- **Se marca lograda cuando** el `<h1>` tiene texto y ya no dice «Mi primera página».

#### Misión 2 · Preséntate en un párrafo

- **Qué hacer:** Escribe dentro de `<p>` quién eres, con tus propias palabras.
- **Pista 1:** El párrafo `<p>` sirve para escribir texto normal, como en tu cuaderno.
- **Pista 2:** Ejemplo: `<p>Estoy en segundo de secundaria y me gusta dibujar.</p>`
- **Se marca lograda cuando** el primer `<p>` tiene texto y ya no dice «Escribe aquí tu nombre y una presentación corta».

#### Misión 3 · Crea la sección «Mis gustos»

- **Qué hacer:** Agrega un subtítulo `<h2>` y, debajo, un nuevo `<p>` que cuente lo que te gusta.
- **Pista 1:** `<h2>` es un subtítulo: se ve más pequeño que `<h1>`. Escríbelo debajo de tu párrafo.
- **Pista 2:** Ejemplo: `<h2>Mis gustos</h2>` `<p>Me gusta el fútbol y la música.</p>`
- **Se marca lograda cuando** hay un `<h2>` con texto y la página tiene al menos dos párrafos `<p>` con texto.

**⚠️ Errores frecuentes:**

- Olvidar la barra `/` al cerrar: `<h1>Hola<h1>`.
- Borrar sin querer un `<` o un `>`.
- Escribir el texto fuera de las etiquetas.

---

### 1.2 · Mi libro o película favorita

> Diseña la portada de una historia que te guste: título, resumen, imagen y créditos.

- **Aprenderás:** `<img>` `src` `alt`
- **Tiempo:** 20 min · **Tipo:** principal · **Misiones:** 4
- **Id interno:** `portada` (no cambiarlo)

**💡 Idea clave:** `<img>` es una etiqueta sin cierre: toda su información va en sus **atributos**. `src` dice *dónde está* la imagen y `alt` dice *qué hay en ella*, para quien no puede verla (por ejemplo, una persona ciega que usa un lector de pantalla) o para cuando la imagen no carga.

**🎬 Video de refuerzo:**

- [Imágenes en HTML5: etiqueta img, src, alt y enlaces](https://www.youtube.com/watch?v=DbTnucVRUN0)
- [Para qué sirve el atributo ALT en HTML](https://www.youtube.com/watch?v=c2ZeBnLyCL4)

**Código inicial:** (sin cambios)

```html
<!-- Subsesión 1.2: Mi libro o película favorita -->
<main>
  <h1>El viaje increíble</h1>
  <p>Una historia sobre la aventura y la amistad.</p>
  <img src="https://placehold.co/480x280?text=Mi+portada" alt="Imagen de la portada">
</main>
```

#### Misión 1 · Elige tu historia

- **Qué hacer:** Cambia el `<h1>` por el título de tu libro o película favorita.
- **Pista 1:** Puede ser un libro del plan lector, una película o una serie que te guste.
- **Pista 2:** Ejemplo: `<h1>El principito</h1>`
- **Se marca lograda cuando** el `<h1>` tiene texto y ya no dice «El viaje increíble».

#### Misión 2 · Escribe el resumen

- **Qué hacer:** Cuenta de qué trata la historia en el primer `<p>`, con tus palabras.
- **Pista 1:** Responde en una o dos oraciones: ¿quién es el personaje principal y qué le pasa?
- **Pista 2:** Ejemplo: `<p>Un niño viaja por varios planetas y aprende el valor de la amistad.</p>`
- **Se marca lograda cuando** el primer `<p>` tiene texto y ya no dice «Una historia sobre la aventura y la amistad».

#### Misión 3 · Pon tu imagen y descríbela

- **Qué hacer:** Elige **una** de estas dos opciones y luego escribe en `alt` qué se ve en la imagen.
  - **Opción A:** usa una dirección de imagen que te dé tu docente o que encuentres. Debe empezar con `https://`.
  - **Opción B:** deja la imagen de placehold.co, pero cambia lo que va después de `text=` por el nombre de tu historia. Usa `+` en lugar de espacios.
- **Pista 1:** Para la opción A, haz clic derecho sobre una imagen y elige «Copiar dirección de imagen». Si la imagen no aparece en tu página, esa web no deja usarla: prueba con otra o usa la opción B.
- **Pista 2:** Opción B: `src="https://placehold.co/480x280?text=El+principito"`. `alt` describe la imagen: `alt="Un niño de pie sobre un planeta pequeño"`.
- **Se marca lograda cuando** el `src` empieza con `https://`, es distinto de la imagen de ejemplo (si es de placehold.co, el `text=` ya no dice «Mi+portada») y el `alt` tiene texto distinto de «Imagen de la portada». Tampoco cuenta un `alt` de una sola palabra genérica: «imagen», «foto», «portada», «image», «img» o «picture».
- **🔧 Cambio en la plataforma:** antes se rechazaba cualquier imagen de placehold.co y se aceptaba un `src` que no fuera una dirección web.

#### Misión 4 · Agrega los créditos

- **Qué hacer:** Escribe otro `<p>` **debajo de la imagen** con el autor o director y el año.
- **Pista 1:** Escribe el nuevo párrafo después de `<img>` y antes de `</main>`.
- **Pista 2:** Ejemplo: `<p>Autor: Antoine de Saint-Exupéry, 1943</p>`
- **Se marca lograda cuando** hay un `<p>` con texto **después de la `<img>`**, dentro de `<main>`.
- **🔧 Cambio en la plataforma:** antes bastaba con tener dos párrafos en cualquier lugar.

**⚠️ Errores frecuentes:**

- Pegar la dirección de la *página* en lugar de la dirección de la *imagen*.
- Borrar una comilla de `src="…"` y romper la etiqueta.
- Escribir un `alt` que no describe nada, como «imagen» o «foto».

---

### 1.3 · Mi tarea del colegio

> Ordena una tarea de cualquier curso con introducción, ideas principales, fuente y conclusión.

- **Aprenderás:** `<ul>` `<li>` `<a href>`
- **Tiempo:** 20 min · **Tipo:** principal · **Misiones:** 5
- **Id interno:** `tarea-escolar` (no cambiarlo)

**💡 Idea clave:** `<ul>` es la lista completa y cada `<li>` es un punto de esa lista, como las viñetas de un resumen. `<a>` es un enlace: `href` dice a dónde lleva y el texto entre `<a>` y `</a>` es lo que se lee. Citar la fuente es decir de dónde sacaste la información, igual que en un trabajo escrito.

**🎬 Video de refuerzo:**

- [Listas en HTML: cómo usar ul, ol y li correctamente](https://www.youtube.com/watch?v=TtaHAg4lQ_M)
- Para los enlaces: [Imágenes en HTML5: etiqueta img, src, alt y enlaces](https://www.youtube.com/watch?v=DbTnucVRUN0) (la parte de enlaces). En la plataforma es la pista 3 de la misión 4.

**Código inicial:** (sin cambios)

```html
<!-- Subsesión 1.3: Mi tarea del colegio -->
<main>
  <h1>Los planetas</h1>
  <p>Escribe una introducción al tema de tu tarea.</p>
  <h2>Ideas principales</h2>
  <ul>
    <li>Primera idea</li>
    <li>Segunda idea</li>
  </ul>
  <a href="https://es.wikipedia.org/">Fuente para consultar</a>
</main>
```

#### Misión 1 · Escribe el tema

- **Qué hacer:** Cambia el `<h1>` por el tema de tu tarea. Puede ser de cualquier curso.
- **Pista 1:** Elige un tema que estés estudiando: Ciencia y Tecnología, Ciencias Sociales, Comunicación, Arte y Cultura…
- **Pista 2:** Ejemplo: `<h1>El ciclo del agua</h1>`
- **Se marca lograda cuando** el `<h1>` tiene texto y ya no dice «Los planetas».

#### Misión 2 · Redacta la introducción

- **Qué hacer:** Escribe en el primer `<p>` de qué trata tu tarea.
- **Pista 1:** Dos o tres oraciones bastan: ¿qué es el tema y por qué es importante?
- **Pista 2:** Ejemplo: `<p>El ciclo del agua explica cómo el agua viaja entre el mar, el cielo y la tierra.</p>`
- **Se marca lograda cuando** el primer `<p>` tiene texto y ya no dice «Escribe una introducción al tema de tu tarea».

#### Misión 3 · Haz una lista de ideas

- **Qué hacer:** Escribe tres ideas principales, cada una en un `<li>` dentro de `<ul>`.
- **Pista 1:** Cada `<li>` es un punto de la lista. Copia una línea `<li>…</li>` para agregar otra y reemplaza los textos de ejemplo.
- **Pista 2:** Ejemplo: `<li>El agua se evapora con el calor del sol.</li>`
- **Se marca lograda cuando** hay al menos tres `<li>` con texto propio («Primera idea» y «Segunda idea» no cuentan).
- **🔧 Cambio en la plataforma:** se quita la condición del `<h2>`, que ya venía escrito en el código inicial.

#### Misión 4 · Cita tu fuente

- **Qué hacer:** Cambia el `href` del enlace por la página que consultaste y cambia el texto del enlace por el nombre de esa página. La dirección debe empezar con `https://`.
- **Pista 1:** `href` es la dirección a la que lleva el enlace. Cópiala de la barra de direcciones del navegador.
- **Pista 2:** Ejemplo: `<a href="https://es.wikipedia.org/wiki/Ciclo_hidrológico">Wikipedia: Ciclo hidrológico</a>`
- **Se marca lograda cuando** el `href` empieza con `https://`, tiene un dominio, no es `https://es.wikipedia.org/` y el texto del enlace ya no dice «Fuente para consultar».
- **🔧 Cambio en la plataforma:** antes se aceptaba `http://` (aunque la instrucción pedía `https://`) y no se revisaba el texto del enlace.

#### Misión 5 · Escribe tu conclusión

- **Qué hacer:** Agrega un último `<p>`, después de la lista, con lo que aprendiste.
- **Pista 1:** La conclusión responde: ¿qué aprendí con esta tarea?
- **Pista 2:** Ejemplo: `<p>Aprendí que el agua de la Tierra siempre se recicla.</p>`
- **Se marca lograda cuando** hay un párrafo `<p>` con texto después de la lista `<ul>`.

**⚠️ Errores frecuentes:**

- Escribir un `<li>` fuera de `<ul>`.
- Olvidar las comillas del `href` o el `https://`.
- Copiar párrafos enteros de la fuente: recuérdales que escriban con sus palabras.

---

### 1.4 · Mi perfil de estudiante (reto)

> Reto: tu perfil tiene todo el contenido, pero está desordenado. Organízalo en partes: encabezado, secciones y pie de página.

- **Aprenderás:** `<header>` `<section>` `<footer>`
- **Tiempo:** 15 min · **Tipo:** reto opcional, para quien termina antes · **Misiones:** 5
- **Id interno:** `cv` (no cambiarlo)
- **🔧 Cambio en la plataforma:** nuevo código inicial y nuevas revisiones. Antes las etiquetas ya venían escritas y el estudiante solo cambiaba textos.

**💡 Idea clave:** Una página bien hecha se divide en partes, como un periódico. `<header>` es la parte de arriba con el nombre, cada `<section>` agrupa un tema y `<footer>` es el pie de página con el contacto. No cambian cómo se ve la página, pero le dicen al navegador (y a los lectores de pantalla) qué es cada parte.

**🎬 Video de refuerzo:**

- [HTML semántico y etiquetas semánticas: ¿qué significa? ¿para qué sirve?](https://www.youtube.com/watch?v=wx92etmlHtc)
- Alternativa: [Etiquetas semánticas de maquetación en HTML5](https://www.youtube.com/watch?v=2wM33q5Fp2E)

**Código inicial nuevo:**

```html
<!-- Subsesión 1.4 (reto): Mi perfil de estudiante -->
<!-- Todo el contenido está aquí, pero sin ordenar. Tu reto es organizarlo. -->
<main>
  <h1>Tu primer nombre</h1>
  <p>Estudiante de secundaria</p>

  <h2>Sobre mí</h2>
  <p>Escribe quién eres y qué te gusta aprender.</p>

  <h2>Lo que hago bien</h2>
  <ul>
    <li>Comunicación</li>
    <li>Trabajo en equipo</li>
  </ul>

  <a href="mailto:tu-correo@ejemplo.com">Contactarme</a>
</main>
```

#### Misión 1 · Arma el encabezado

- **Qué hacer:** Encierra el `<h1>` y el primer `<p>` dentro de un `<header>`. Cambia «Tu primer nombre» por tu primer nombre.
- **Pista 1:** Escribe `<header>` justo antes del `<h1>` y `</header>` justo después del primer `</p>`.
- **Pista 2:** Ejemplo: `<header>` `<h1>Ana</h1>` `<p>Estudiante de 2.° de secundaria</p>` `</header>`
- **Se marca lograda cuando** hay un `<header>` que contiene un `<h1>` con texto distinto de «Tu primer nombre».

#### Misión 2 · Crea la sección «Sobre mí»

- **Qué hacer:** Encierra el subtítulo «Sobre mí» y su párrafo dentro de un `<section>`. Personaliza el párrafo.
- **Pista 1:** Cada `<section>` agrupa un tema: su subtítulo y todo lo que va debajo.
- **Pista 2:** Ejemplo: `<section>` `<h2>Sobre mí</h2>` `<p>Me gusta aprender cómo funcionan las cosas.</p>` `</section>`
- **Se marca lograda cuando** hay un `<section>` cuyo `<h2>` dice «Sobre mí» y cuyo `<p>` tiene texto distinto de «Escribe quién eres y qué te gusta aprender».

#### Misión 3 · Crea la sección «Lo que hago bien»

- **Qué hacer:** Encierra el subtítulo «Lo que hago bien» y su lista en otro `<section>`. Deja al menos tres cosas en la lista.
- **Pista 1:** Abre `<section>` antes del `<h2>` y ciérralo después de `</ul>`. Agrega una línea `<li>…</li>` por cada habilidad.
- **Pista 2:** Ejemplo: `<li>Explicar temas a mis compañeros</li>`
- **Se marca lograda cuando** hay un `<section>` que contiene una `<ul>` con al menos tres `<li>` con texto.

#### Misión 4 · Crea una sección nueva desde cero

- **Qué hacer:** Escribe tú mismo un tercer `<section>` con el subtítulo «Mis proyectos del colegio» y un párrafo sobre un trabajo que te haya gustado.
- **Pista 1:** Copia la forma de las otras secciones: `<section>`, luego `<h2>`, luego `<p>` y al final `</section>`.
- **Pista 2:** Ejemplo: `<p>Hice una maqueta del sistema solar para Ciencia y Tecnología.</p>`
- **Se marca lograda cuando** hay al menos tres `<section>` y una de ellas, que no sea «Sobre mí» ni «Lo que hago bien», tiene un `<h2>` con texto y un `<p>` con texto. Así no basta con escribir un `<section>` vacío.

#### Misión 5 · Arma el pie de página

- **Qué hacer:** Encierra el enlace de contacto dentro de un `<footer>` y cambia el correo por uno **de práctica**. No uses tu correo real.
- **Pista 1:** `<footer>` es el pie de página. `mailto:` hace que el enlace abra un correo nuevo.
- **Pista 2:** Ejemplo: `<footer><a href="mailto:ana.practica@ejemplo.com">Escríbeme</a></footer>`
- **Se marca lograda cuando** hay un `<footer>` con un enlace `mailto:` que tiene una `@` y ya no es `mailto:tu-correo@ejemplo.com`.

**⚠️ Errores frecuentes:**

- Abrir `<section>` y olvidar cerrarlo: todo lo que sigue queda dentro.
- Cerrar en desorden: `<section><h2>…</section></h2>`.
- Escribir datos reales: correo, apellidos o dirección.

---

### Lista de cotejo · Sesión 1

| Criterio | Sí | No | Observación |
| --- | --- | --- | --- |
| Usa `<h1>` y `<p>` con texto propio. | | | |
| Agrega una imagen con un `alt` que la describe. | | | |
| Organiza sus ideas en una lista de al menos tres puntos. | | | |
| Cita la fuente consultada con un enlace que funciona. | | | |
| Escribe con sus propias palabras, sin copiar la fuente. | | | |
| *(Reto)* Organiza su perfil con `<header>`, `<section>` y `<footer>`. | | | |

*La plataforma revisa que las etiquetas estén bien; la calidad del texto la revisa el docente con la página descargada.*

---

## Sesión 2: Le doy estilo a mi página

**Área:** CSS · **Duración:** 90 minutos · **Subsesiones:** 4 · **Misiones:** 16 · **Archivo:** `js/sesiones/sesion2.js`

### Ficha de la sesión

- **Competencia transversal (CNEB):** Se desenvuelve en entornos virtuales generados por las TIC.
  - **Capacidad:** Crea objetos virtuales en diversos formatos.
- **Propósito:** Hoy aprenderé a mejorar la apariencia de una página con colores, letras, bordes y espacios usando CSS.
- **Producto final:** Tu página decorada con tu propio estilo, descargada con el botón «Descargar».
- **Palabras nuevas:** CSS, regla, selector, propiedad, valor, clase, contraste.
- **Lo lograré cuando…**
  - Cambio los colores del texto y del fondo, y compruebo que el texto se lea bien.
  - Elijo una letra y un tamaño fáciles de leer.
  - Uso bordes y espacios para ordenar el contenido.
- **Si hago el reto, además…**
  - Hago que un botón o un enlace reaccione al cursor y que la tarjeta se vea bien en el celular.

### Cómo se desarrolla la clase

| Momento | Tiempo | Qué pasa |
| --- | --- | --- |
| Inicio | 10 min | Pregunta: «¿Qué página web te parece bonita y fácil de leer? ¿Qué colores y letras usa?» Luego muestra en la pizarra la forma de una regla: `selector { propiedad: valor; }`, y explica cada parte con la idea clave de la 2.1. |
| Desarrollo | 70 min | 2.1 Pinta tu página (15 min) → 2.2 Letras con personalidad (15 min) → 2.3 Cajas y espacios (20 min) → 2.4 Botones vivos y celular (20 min, reto) |
| Cierre | 10 min | Preguntas: 1) ¿Qué propiedad CSS te gustó más y por qué? 2) ¿Cómo ayudan `padding` y `margin` a que la página se lea mejor? 3) Mira tu página: ¿el texto se lee bien sobre el fondo? ¿Qué cambiarías? Después, todos descargan su página. |

> **Continuidad:** en esta sesión, cada subsesión empieza con el código que el estudiante dejó en la anterior. Si entra a una subsesión sin haber escrito nada antes, empieza con el código inicial.

> **Qué formas de CSS se aceptan:** una regla cuenta aunque el selector esté en una lista (`h1, h2 { color: red; }`), dentro de otro (`main h1 { … }`) o combinado con la etiqueta (`article.tarjeta { … }`). También cuentan los atajos: `background: red` vale como color de fondo y `font: 16px Verdana` vale como `font-family`. Los comentarios `/* … */` no cuentan.

**Código inicial de la sesión** (🔧 se quita `class="pagina"`, que ninguna misión usaba):

```html
<main>
  <h1>Mi Página Pintada</h1>
  <p>Este texto necesita color y estilo.</p>
  <article class="tarjeta">
    <h2>Mi primer diseño</h2>
    <p>Usa CSS para que esta tarjeta destaque.</p>
    <a href="https://example.com/">Visitar un sitio de ejemplo</a>
    <button type="button">Explorar</button>
  </article>
</main>

<style>
  /* Escribe aquí tus reglas: selector { propiedad: valor; } */
</style>
```

### Subsesiones

| N.º | Subsesión | Qué hace el estudiante | Aprenderás | Misiones | Tiempo |
| --- | --- | --- | --- | --- | --- |
| 2.1 | Pinta tu página | Cambia los colores del título, de los párrafos y del fondo. | `color` `background-color` | 3 | 15 min |
| 2.2 | Letras con personalidad | Elige la letra, el tamaño y el espacio entre líneas. | `font-family` `font-size` `line-height` `text-align` | 4 | 15 min |
| 2.3 | Cajas y espacios | Convierte la tarjeta en una caja ordenada con borde, esquinas y espacios. | `border` `border-radius` `padding` `margin` `box-shadow` | 5 | 20 min |
| 2.4 | Botones vivos y celular (reto) | Hace que el botón y el enlace reaccionen y que la tarjeta se vea bien en el celular. | `:hover` `@media` `:focus-visible` | 4 | 20 min |

---

### 2.1 · Pinta tu página

> Cambia los colores del título, de los párrafos y del fondo.

- **Aprenderás:** `color` `background-color`
- **Tiempo:** 15 min · **Tipo:** principal · **Misiones:** 3
- **Id interno:** `colores` (no cambiarlo)

**💡 Idea clave:** Una regla CSS responde tres preguntas: **¿a quién?** (selector), **¿qué cambio?** (propiedad) y **¿cómo?** (valor). `h1 { color: purple; }` se lee: «al título, cámbiale el color a morado». Es como pintar tu cuarto: eliges la pared, decides que vas a cambiar el color y escoges cuál.

**🎬 Video de refuerzo:**

- [Curso básico de CSS – 2. Selectores](https://www.youtube.com/watch?v=uqkj7HQ7ids) (FalconMasters): selectores de etiqueta y de clase.
- Alternativa: [Explorando las propiedades más populares de CSS](https://youtu.be/5eFJ-RA_LCA), recomendado en un recurso del currículo nacional de Chile.

#### Misión 1 · Pinta el título

- **Qué hacer:** Escribe una regla para `h1` con la propiedad `color`.
- **Pista 1:** Una regla CSS tiene selector, llaves y propiedad: `selector { propiedad: valor; }`. Escríbela dentro de `<style>`.
- **Pista 2:** Ejemplo: `h1 { color: purple; }`
- **Se marca lograda cuando** hay una regla para `h1` con la propiedad `color`.

#### Misión 2 · Colorea los párrafos

- **Qué hacer:** Cambia el color del texto de los párrafos con el selector `p`.
- **Pista 1:** El selector `p` cambia todos los párrafos a la vez.
- **Pista 2:** Ejemplo: `p { color: #334155; }`
- **Se marca lograda cuando** hay una regla para `p` con la propiedad `color`.

#### Misión 3 · Elige un fondo que se lea bien

- **Qué hacer:** Dale un color de fondo a toda la página con `body`. Comprueba que tu texto se siga leyendo.
- **Pista 1:** `body` es toda la página y la propiedad del fondo es `background-color`. Si tu letra es oscura, elige un fondo claro; si tu letra es clara, un fondo oscuro. A eso se le llama **contraste**.
- **Pista 2:** Ejemplo: `body { background-color: lightyellow; }`
- **Se marca lograda cuando** hay una regla para `body` con `background` o `background-color`.

**⚠️ Errores frecuentes:**

- Escribir los colores en español: `color: rojo` no funciona. Van en inglés (`red`, `blue`, `green`) o en código (`#ff0000`).
- Olvidar las llaves `{ }` o el punto y coma `;`.
- Escribir las reglas fuera de `<style>`.
- Escribir mal la propiedad: `backgroud-color`, `colour`.

---

### 2.2 · Letras con personalidad

> Elige la letra, el tamaño y el espacio entre líneas para que tu página se lea mejor.

- **Aprenderás:** `font-family` `font-size` `line-height` `text-align`
- **Tiempo:** 15 min · **Tipo:** principal · **Misiones:** 4
- **Id interno:** `tipografia` (no cambiarlo)

**💡 Idea clave:** Un texto se lee mejor cuando la letra es clara, el tamaño es suficiente y las líneas no están pegadas. En `font-family` escribes primero la letra que quieres y al final una de respaldo (`sans-serif`), por si la computadora no tiene la primera.

**🎬 Video de refuerzo:**

- ⚠️ **Falta un video.** El de `line-height` que estaba aquí («Curso de HTML y CSS #33 – Tipografía: line-height») ya no existe en YouTube. Mientras tanto, la 2.2 no tiene pista 3 en la plataforma. Cuando elijas un reemplazo, agrégalo en `js/sesiones/sesion2.js`, en la subsesión `tipografia`, con la misma forma que las demás: `video: { title: '…', youtubeId: '…' }`.
- Para `font-family` y `font-size`: el curso completo de freeCodeCamp en español (ver «Para repasar en casa»), en la parte de formato de texto.

#### Misión 1 · Elige una letra

- **Qué hacer:** Usa `font-family` en `body` para cambiar la letra de toda la página.
- **Pista 1:** Letras que funcionan en casi todas las computadoras: `Verdana`, `Georgia`, `Arial`, `Tahoma`. Al final agrega `sans-serif` o `serif`.
- **Pista 2:** Ejemplo: `body { font-family: Verdana, sans-serif; }`
- **Se marca lograda cuando** hay una regla para `body` con `font-family` (o con el atajo `font`).

#### Misión 2 · Agranda los párrafos

- **Qué hacer:** Cambia el tamaño de la letra de los párrafos con `font-size`.
- **Pista 1:** Los tamaños se escriben en `px`. El tamaño normal es `16px`; para leer cómodo, usa entre `16px` y `20px`.
- **Pista 2:** Ejemplo: `p { font-size: 18px; }`
- **Se marca lograda cuando** hay una regla para `p` con `font-size`.

#### Misión 3 · Separa las líneas

- **Qué hacer:** Usa `line-height` en `body` o en `p` para dejar aire entre las líneas.
- **Pista 1:** Un valor entre `1.4` y `1.8`, sin `px`, hace que el texto se lea mejor.
- **Pista 2:** Ejemplo: `body { line-height: 1.6; }`
- **Se marca lograda cuando** hay una regla para `body` o para `p` con `line-height`.

#### Misión 4 · Centra el título

- **Qué hacer:** Usa `text-align` en `h1` para centrarlo.
- **Pista 1:** `text-align` alinea el texto a la izquierda (`left`), al centro (`center`) o a la derecha (`right`).
- **Pista 2:** Ejemplo: `h1 { text-align: center; }`
- **Se marca lograda cuando** hay una regla para `h1` con `text-align`.

**⚠️ Errores frecuentes:**

- Escribir el tamaño sin unidad: `font-size: 18` no funciona; va `18px`.
- Escribir dos reglas para `body` y no darse cuenta de cuál manda (gana la que está más abajo).
- Elegir tamaños muy pequeños que cuestan leer.

---

### 2.3 · Cajas y espacios

> Convierte el artículo con la clase «tarjeta» en una caja ordenada con borde, esquinas y espacios.

- **Aprenderás:** `border` `border-radius` `padding` `margin` `box-shadow`
- **Tiempo:** 20 min · **Tipo:** principal · **Misiones:** 5
- **Id interno:** `tarjetas` (no cambiarlo)

**💡 Idea clave:** En CSS todo es una caja. Piensa en una foto enmarcada colgada en la pared: la foto es el **contenido**, el espacio blanco entre la foto y el marco es el **padding**, el marco es el **border** y la distancia hasta el siguiente cuadro es el **margin**.

**🎬 Video de refuerzo:**

- [Curso básico de CSS – 5. Modelo de caja](https://youtu.be/SKkKLi1wAos) (FalconMasters, el mismo curso del video de la 2.1), recomendado en un recurso del currículo nacional de Chile.
- *La alternativa que estaba aquí («Modelo de caja CSS: padding, border y margin») ya no existe en YouTube.*

**Sugerencia docente:** si hay proyector, abre la página, pulsa F12 y selecciona la tarjeta. Las herramientas del navegador dibujan el modelo de caja con colores distintos para el padding, el borde y el margen.

#### Misión 1 · Dibuja el borde

- **Qué hacer:** Agrega un borde a `.tarjeta` con grosor, estilo y color.
- **Pista 1:** El punto de `.tarjeta` indica una clase: en el HTML aparece como `class="tarjeta"`. El borde necesita tres datos: grosor (`2px`), estilo (`solid`) y color.
- **Pista 2:** Ejemplo: `.tarjeta { border: 2px solid #6366f1; }`
- **Se marca lograda cuando** hay una regla para `.tarjeta` con un borde visible, es decir, con estilo (por ejemplo `solid`). `border-radius` no cuenta como borde.

#### Misión 2 · Redondea las esquinas

- **Qué hacer:** Usa `border-radius` en la tarjeta.
- **Pista 1:** Mientras más grande el número, más redondas las esquinas.
- **Pista 2:** Ejemplo: `.tarjeta { border-radius: 12px; }`
- **Se marca lograda cuando** hay una regla para `.tarjeta` con `border-radius`.

#### Misión 3 · Dale espacio por dentro

- **Qué hacer:** Usa `padding` para separar el contenido del borde.
- **Pista 1:** `padding` es el espacio entre el borde y el contenido, como el espacio blanco entre la foto y el marco.
- **Pista 2:** Ejemplo: `.tarjeta { padding: 16px; }`
- **Se marca lograda cuando** hay una regla para `.tarjeta` con `padding`.

#### Misión 4 · Dale espacio por fuera

- **Qué hacer:** Usa `margin` para separar la tarjeta del resto de la página.
- **Pista 1:** `margin` es el espacio fuera del borde, como la distancia entre un cuadro y otro.
- **Pista 2:** Ejemplo: `.tarjeta { margin: 24px; }`
- **Se marca lograda cuando** hay una regla para `.tarjeta` con `margin`.

#### Misión 5 · Agrega una sombra

- **Qué hacer:** Haz que la tarjeta destaque con `box-shadow`.
- **Pista 1:** La sombra lleva cuatro datos: movimiento horizontal, movimiento vertical, desenfoque y color.
- **Pista 2:** Ejemplo: `.tarjeta { box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); }`
- **Se marca lograda cuando** hay una regla para `.tarjeta` con `box-shadow`.

**⚠️ Errores frecuentes:**

- Escribir `tarjeta { … }` sin el punto: así no encuentra la clase.
- Escribir `border: 2px red` sin estilo: el borde no aparece.
- Confundir `padding` (adentro) con `margin` (afuera).

---

### 2.4 · Botones vivos y celular (reto)

> Reto: haz que el botón y el enlace reaccionen, y que la tarjeta se vea bien en el celular.

- **Aprenderás:** `:hover` `@media` `:focus-visible`
- **Tiempo:** 20 min · **Tipo:** reto opcional, para quien termina antes · **Misiones:** 4
- **Id interno:** `interaccion-responsive` (no cambiarlo)

**💡 Idea clave:** Algunas reglas solo se aplican en ciertos momentos. `:hover` se aplica cuando el cursor está encima; `:focus-visible`, cuando eliges algo con la tecla Tab; y `@media`, solo cuando la pantalla es pequeña, como la de un celular.

**🎬 Video de refuerzo:**

- [Pseudoclases hover y focus en CSS](https://www.youtube.com/watch?v=i_N-9NRnjNI). En la plataforma es la pista 3 de las misiones 1, 2 y 4.
- [Aprende media queries en CSS](https://www.youtube.com/watch?v=yneuaVjotO8). En la plataforma es la pista 3 de la misión 3.

#### Misión 1 · Diseña el botón

- **Qué hacer:** Cambia el color de fondo del botón usando el selector `button`.
- **Pista 1:** Combina un fondo oscuro con letra clara para que el botón se lea bien.
- **Pista 2:** Ejemplo: `button { background-color: #10b981; color: white; }`
- **Se marca lograda cuando** hay una regla para `button` con `background` o `background-color`.

#### Misión 2 · Reacciona al cursor

- **Qué hacer:** Crea una regla `:hover` para el enlace **o** para el botón, que cambie su color al pasar el cursor.
- **Pista 1:** `:hover` solo se aplica cuando el cursor está encima del elemento. Se escribe pegado, sin espacio: `a:hover`.
- **Pista 2:** Ejemplo: `a:hover { color: crimson; }` o `button:hover { background-color: #047857; }`
- **Se marca lograda cuando** hay una regla para `a:hover` o `button:hover` que cambia `color` o `background`.
- **🔧 Cambio en la plataforma:** antes solo se aceptaba `a:hover`, aunque el criterio habla de «un botón o un enlace».

#### Misión 3 · Adapta la tarjeta al celular

- **Qué hacer:** Agrega una regla `@media` que incluya un estilo para `.tarjeta`.
- **Pista 1:** `@media` aplica sus reglas solo en pantallas pequeñas. Dentro de sus llaves van reglas normales. Para ver el efecto, achica la ventana del navegador hasta que sea angosta como un celular.
- **Pista 2:** Ejemplo: `@media (max-width: 600px) { .tarjeta { margin: 8px; } }`
- **Se marca lograda cuando** dentro de un bloque `@media` hay una regla para `.tarjeta` con al menos una propiedad.

#### Misión 4 · Muestra el foco del teclado

- **Qué hacer:** Usa `button:focus-visible` con `outline` para que el botón se note al navegar con Tab.
- **Pista 1:** Haz clic en la vista previa y pulsa Tab: `:focus-visible` marca el botón elegido con el teclado. Esto ayuda a quienes no usan mouse.
- **Pista 2:** Ejemplo: `button:focus-visible { outline: 3px solid orange; }`
- **Se marca lograda cuando** hay una regla para `button:focus-visible` con `outline`.

**⚠️ Errores frecuentes:**

- Dejar un espacio en `a :hover`: así no funciona.
- Olvidar la segunda llave al final del `@media`: necesita dos `}`.
- Pensar que `@media` no funciona porque no achicaron la ventana.
- En el celular `:hover` casi no se nota, porque no hay cursor: por eso existe `:focus-visible`.

---

### Lista de cotejo · Sesión 2

| Criterio | Sí | No | Observación |
| --- | --- | --- | --- |
| Cambia los colores del texto y del fondo. | | | |
| El texto se lee bien sobre el fondo (contraste). | | | |
| Elige una letra y un tamaño fáciles de leer. | | | |
| Usa borde, `padding` y `margin` para ordenar la tarjeta. | | | |
| *(Reto)* El botón o el enlace reacciona al cursor. | | | |
| *(Reto)* La tarjeta se adapta a pantallas pequeñas. | | | |

---

## Para repasar en casa

- [Aprende HTML y CSS – Curso desde cero](https://www.youtube.com/watch?v=XqFR2lqBYPs), de freeCodeCamp en español (Estefania Cassingena Navone). Dura más de 5 horas y va de los encabezados y párrafos hasta padding, margin y colores. Es para estudiantes avanzados o para que el docente repase.
- [Aprende HTML y CSS – Curso desde cero](https://www.freecodecamp.org/espanol/news/aprende-html-y-css-curso-desde-cero/): el artículo que acompaña al curso, con un resumen escrito de cada tema.

---

## Cómo están escritos en el código

Cada subsesión de `js/sesiones/sesion1.js` y `js/sesiones/sesion2.js` tiene estos campos nuevos:

```js
idea: 'Una etiqueta es como una caja con nombre…', // «Idea clave»; acepta <code> y <strong>
video: {
  title: 'Qué es HTML: primeros pasos',
  youtubeId: 'pDla5cvhNas', // lo que va después de watch?v= en la dirección de YouTube
  start: 19,                // opcional: segundo en que empieza
  end: 345,                 // opcional: segundo en que termina
  note: 'de 0:19 a 5:45'    // opcional: se muestra junto al título
}
```

- Una misión puede tener su propio `video`, con la misma forma. Si lo tiene, se usa en lugar del de la subsesión.
- Si una subsesión no tiene `video`, sus misiones solo muestran las pistas 1 y 2.
- Cada sesión tiene además `competency` (competencia y capacidad del CNEB) y, si hace falta, `challengeCriteria` (criterios que solo aplican al reto). Ambos se ven en la ficha de la sesión.
- Las pruebas (`npm test`) revisan que cada subsesión tenga idea clave y que cada video tenga un identificador de YouTube con formato válido.

**Pendiente:** que el panel docente cuente cuántos estudiantes llegaron a la pista 3 en cada misión. Para eso hace falta guardar el uso de pistas en Supabase, con una tabla o columna nueva.
