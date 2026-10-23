# Mejoras de las sesiones

Este documento explica qué cambió en las sesiones de Academia Web para que se usen mejor en el colegio, y cómo escribir sesiones nuevas.

## Resumen

Cada sesión ahora funciona como una clase: tiene un **propósito**, un **inicio** (en la sala de espera), un **desarrollo** (subsesiones con misiones y pistas) y un **cierre** (preguntas de reflexión). En pantalla solo se usan tres palabras:

| Palabra | Qué es | Ejemplo |
| --- | --- | --- |
| **Sesión** | Una clase con un propósito y un producto final. | Sesión 1: Mi primera página web |
| **Subsesión** | Un reto de 15 a 20 minutos que termina en algo visible. | 1.2 · Mi libro o película favorita |
| **Misión** | Un paso corto que la plataforma revisa sola. | Pon tu imagen y descríbela |

Las palabras «proyecto», «actividad» y «práctica» ya no aparecen en el laboratorio ni en el panel. Lo que el docente inicia y pausa ahora se llama «clase».

## Lo que cambió para el estudiante

1. **Su código ya no se pierde.** Antes, al cambiar de subsesión o recargar la página, el editor volvía al código inicial. Ahora cada subsesión guarda su código en el navegador y lo recupera al volver.
2. **La Sesión 2 tiene continuidad.** Cada subsesión de CSS empieza con el código que el estudiante dejó en la anterior, así que los colores de 2.1 siguen ahí en 2.2.
3. **Ve el propósito de la clase.** Arriba del panel aparece «Hoy aprenderé a…» y, al desplegarla, la ficha de la sesión: producto final, palabras nuevas y criterios de logro.
4. **Mapa de subsesiones.** El menú desplegable se reemplazó por una lista con número (1.1, 1.2…), estado (Lograda / Ahora), misiones logradas y tiempo sugerido. Los retos opcionales están marcados como «Reto».
5. **Una misión a la vez.** La misión actual se abre sola y lleva la etiqueta «Ahora». Las demás muestran su número en lugar de un candado, porque se pueden hacer en cualquier orden.
6. **Pistas antes que ayuda.** Cada misión tiene el botón «Necesito una pista»: la primera pista explica la idea y la segunda muestra un ejemplo de código.
7. **Cierre de la sesión.** Al lograr una subsesión aparece «Seguir con 1.3 · …». Cuando termina todas las subsesiones principales, ve las preguntas de cierre y el recordatorio de descargar su página.
8. **Inicio en la sala de espera.** Mientras espera al docente, el estudiante ve qué aprenderá hoy y una pregunta para pensar.
9. **Ayuda con contexto.** Al pedir ayuda, el mensaje incluye automáticamente la subsesión y la misión en la que está.
10. **Reiniciar pide confirmación**, porque borra el código y las misiones de esa subsesión.

## Lo que cambió para el docente

- **El panel lee las mismas sesiones que el laboratorio.** Antes, `teacher.js` tenía el catálogo copiado a mano con el número de misiones. Ahora lo arma desde `js/sesiones/`, así que una misión nueva aparece en el panel sin tocarlo.
- **Actividad reciente con nombre de misión**: «Misión 3: Pon tu imagen y descríbela» en lugar de solo «Misión 3».
- **Textos más claros**: «Iniciar la clase», «Pausar la clase», «Clase en curso», «Salir del panel».
- **El SQL acepta sesiones nuevas.** `session_id` ya no está limitado a `sesion1` y `sesion2`: acepta `sesion3`, `sesion4`, etc.

## Las sesiones ahora

### Sesión 1 · Mi primera página web (HTML)

**Propósito:** crear una página web con títulos, párrafos, imágenes, listas y enlaces.

| Subsesión | Aprenderás | Misiones |
| --- | --- | --- |
| 1.1 ¡Hola, soy yo! · 15 min | `<h1>` `<p>` `<h2>` | Nombre como título · Presentación en un párrafo · Sección «Mis gustos» con subtítulo y párrafo |
| 1.2 Mi libro o película favorita · 20 min | `<img>` `src` `alt` | Título · Resumen · Imagen con su descripción · Créditos |
| 1.3 Mi tarea del colegio · 20 min | `<ul>` `<li>` `<a href>` | Tema · Introducción · Lista de tres ideas · Fuente con enlace · Conclusión |
| 1.4 Reto: Mi perfil de estudiante · 15 min | `<header>` `<section>` `<footer>` | Nombre y colegio · Sobre mí · Lo que hago bien · Un proyecto del colegio · Contacto de práctica |

«Mi currículum» pasó a llamarse «Mi perfil de estudiante» y habla de grado, colegio y proyectos escolares. Su id interno sigue siendo `cv`.

### Sesión 2 · Le doy estilo a mi página (CSS)

**Propósito:** mejorar la apariencia de una página con colores, letras, bordes y espacios usando CSS.

| Subsesión | Aprenderás | Misiones |
| --- | --- | --- |
| 2.1 Pinta tu página · 15 min | `color` `background-color` | Color del título · Color de los párrafos · Fondo de la página |
| 2.2 Letras con personalidad · 15 min | `font-family` `font-size` `line-height` `text-align` | Letra · Tamaño · Espacio entre líneas · **Centrar el título (nueva)** |
| 2.3 Cajas y espacios · 20 min | `border` `border-radius` `padding` `margin` `box-shadow` | Borde · Esquinas · Espacio por dentro · Espacio por fuera · Sombra |
| 2.4 Reto: Botones vivos y celular · 20 min | `button` `:hover` `@media` `:focus-visible` | Botón · Enlace al pasar el cursor · Tarjeta en el celular · Foco del teclado |

## Validaciones corregidas

| Misión | Antes | Ahora |
| --- | --- | --- |
| 1.3 Conclusión | Se marcaba con cualquier segundo párrafo, aunque estuviera vacío. | Pide un párrafo con texto **después de la lista**. |
| 1.3 Lista de ideas | Contaba ítems vacíos o de ejemplo. | Pide tres ítems con texto propio. |
| 1.3 Fuente | Bastaba cualquier cambio en `href`. | Pide una dirección que empiece con `https://`. |
| 1.4 Sobre mí y Proyecto | Un párrafo vacío contaba como logrado. | Pide texto propio. |
| 1.2 Imagen | Bastaba cambiar `src`; el `alt` de ejemplo ya contaba. | Pide `src` y un `alt` escrito por el estudiante. |
| CSS en general | Solo aceptaba `h1 {`; no contaba `h1, h2 {` ni `main h1 {`, y `background-color` contaba como `color`. | Usa el lector de CSS del navegador: acepta cualquier forma correcta y distingue cada propiedad. |
| 2.3 Borde | `border-radius` contaba como borde. | Pide un borde visible (con estilo, por ejemplo `solid`). |

Las validaciones compartidas están en `window.MissionChecks` (`js/sesiones/index.js`):

- `hasOwnText(elemento, ...textosDeEjemplo)`: el elemento tiene texto y no es el de ejemplo.
- `countWithText(elementos, ...textosDeEjemplo)`: cuántos elementos tienen texto propio.
- `hasStyle(doc, selector, propiedad, { inMedia })`: existe una regla para ese selector con esa propiedad (`'*'` = cualquier propiedad).

## Cómo escribir una sesión

Cada sesión es un archivo en `js/sesiones/` con esta forma:

```js
(function () {
    const { hasOwnText, countWithText, hasStyle } = window.MissionChecks;

    window.SessionRegistry.register({
        id: 'sesion3',
        number: 3,
        title: 'Sesión 3: Organizo información',
        area: 'HTML',
        minutes: 90,
        purpose: 'organizar información con tablas y listas numeradas.', // se lee «Hoy aprenderé a…»
        product: 'Tu horario de clases como página web.',
        vocabulary: ['tabla', 'fila', 'celda', 'encabezado'],
        criteria: ['Uso <table> con filas y celdas.', 'Pongo encabezados con <th>.'],
        start: '¿Dónde has visto información ordenada en filas y columnas?',
        closing: ['¿Cuándo conviene usar una tabla?', '¿Qué fue lo más difícil hoy?'],
        carryCode: false, // true = cada subsesión parte del código de la anterior
        projects: [
            {
                id: 'mi-horario',          // no cambiarlo después: el progreso se guarda con este id
                title: 'Mi horario de clases',
                description: 'Arma tu horario semanal en una tabla.',
                minutes: 20,
                learn: ['<table>', '<tr>', '<td>'],
                challenge: false,          // true = aparece como «Reto»
                baseHTML: '<table>\n  <tr><td>Lunes</td></tr>\n</table>\n',
                missions: [
                    {
                        id: 'm1',          // m1, m2, m3… en orden
                        title: 'Agrega los días',
                        desc: 'Escribe los cinco días de la semana en la primera fila.',
                        hints: [
                            'Primera pista: explica la idea.',
                            'Segunda pista: muestra un ejemplo con <code>&lt;td&gt;Martes&lt;/td&gt;</code>.'
                        ],
                        validate: doc => doc.querySelectorAll('tr:first-child td').length >= 5
                    }
                ]
            }
        ]
    });
})();
```

Para activarla:

1. Agrega la sesión al `catalog` de `js/sesiones/index.js`: `{ id: 'sesion3', title: 'Sesión 3: Organizo información', src: 'js/sesiones/sesion3.js' }`.
2. Corre `npm test`: la prueba revisa que cada misión tenga título, instrucción, dos pistas y validación, y que estén numeradas en orden.
3. No hace falta tocar el panel docente ni el SQL.

Recomendaciones para escribir misiones:

- Una acción por misión, empezando con un verbo: «Escribe…», «Cambia…», «Agrega…».
- La primera pista explica la idea; la segunda muestra un ejemplo de código.
- La validación debe rechazar el código inicial y el texto de ejemplo.
- No cambies los `id` de subsesiones ni de misiones que ya se usaron en clase: el progreso guardado depende de ellos. Agregar misiones al final (`m4`, `m5`) sí es seguro.

## Qué hacer en Supabase

Vuelve a ejecutar `supabase/schema.sql` en el **SQL Editor**. Cambia la restricción de `session_id` en `classroom_control`, `students` y `mission_completions` para aceptar `sesion1`, `sesion2`, `sesion3`… El script se puede ejecutar varias veces y no borra datos.

El progreso que los estudiantes ya tienen se conserva, porque los ids de sesiones, subsesiones y misiones no cambiaron. Hay dos detalles:

- La subsesión 2.2 ahora tiene 4 misiones en lugar de 3; quien la había terminado verá 3 de 4.
- Algunas validaciones son más estrictas, pero las misiones que ya estaban marcadas siguen marcadas.

## Cómo se verificó

- `npm test`: 13 pruebas pasan, entre ellas las nuevas de `test/mission-checks.test.js`.
- En el navegador, con el lector de CSS real, se revisaron las 33 misiones: ninguna se cumple con el código inicial y todas aceptan una solución correcta. Los casos que antes se aprobaban por error ahora se rechazan.
- Se revisó en el navegador el mapa de subsesiones, las pistas, el botón «Seguir con…», el cierre, el guardado del código por subsesión y la continuidad de la Sesión 2. El panel docente carga las sesiones desde los archivos sin errores.
- No se probó con una cuenta real de Supabase (iniciar la clase, registrar misiones, pedir ayuda). Conviene hacer esa prueba con dos navegadores antes de usarlo con estudiantes.

## Pendiente (no implementado)

- **Guardar el código en Supabase.** Hoy se guarda en el navegador, como la cuenta anónima. Si el estudiante cambia de equipo o borra los datos del navegador, pierde el código (y también la cuenta).
- **Inicio y cierre controlados por el docente.** Ahora el inicio se ve en la sala de espera y el cierre aparece al terminar. Un botón en el panel para mostrar el cierre a todos necesitaría una columna nueva en `classroom_control`.
- **Pistas usadas en el panel.** El docente todavía no ve cuántas pistas abrió cada estudiante.
- **Lista de cotejo en el CSV.** Los `criteria` de cada sesión podrían exportarse como «Logrado / En proceso / En inicio».
- **Nuevas sesiones**, por ejemplo: Sesión 3 «Organizo información» (tablas y listas numeradas), Sesión 4 «Mi página en el celular» (`@media` y accesibilidad) y Sesión 5 «Proyecto final» en equipos.
