# Plan de Arquitectura: Laboratorio Web EdTech

Para escalar el sistema y manejar múltiples sesiones sin que el código colapse, pasaremos de un modelo "Todo en uno" a una arquitectura modular basada en componentes y separación de responsabilidades.

## 📁 Propuesta de Estructura de Carpetas

Imagina que este será tu repositorio de GitHub o tu proyecto en Visual Studio Code:

```text
📂 laboratorio-web/
├── 📄 laboratorio_html_en_vivo.html # Editor y vista previa del laboratorio
├── 📄 panel_docente.html             # Interfaz separada del panel docente
├── 📂 css/
│   └── 📄 estilos.css                # Estilos compartidos
├── 📂 js/
    ├── 📂 core/
    │   ├── 📄 app.js                 # Controlador principal
    │   ├── 📄 editor.js              # CodeMirror y redimensionador
    │   ├── 📄 supabase.js            # Autenticación, presencia y sincronización
    │   ├── 📄 supabase-config.js     # URL, clave pública y correo docente
    │   ├── 📄 parser.js              # Análisis del HTML para validaciones
    │   └── 📄 teacher.js             # Lógica del panel docente
    ├── 📂 sesiones/
        ├── 📄 sesion1.js             # Misiones de HTML básico
        ├── 📄 sesion2.js             # Misiones de CSS básico
        └── 📄 index.js               # Catálogo y carga bajo demanda
└── 📂 supabase/
    └── 📄 schema.sql                 # Tablas, RLS y publicación Realtime
```

## 🧠 ¿Cómo funcionará esta nueva arquitectura?

1. **Desacoplamiento del Currículo:** El contenido y las validaciones están fuera del HTML. Para agregar una sesión, crea su archivo en `js/sesiones/` y registra su ruta y título en `js/sesiones/index.js`.
2. **Carga Perezosa (Lazy Loading):** El navegador carga el archivo de una sesión cuando se selecciona por primera vez.
3. **Separación de responsabilidades:** Los estilos, el editor, el analizador, la persistencia y la interfaz docente tienen archivos separados. El laboratorio y el panel docente son páginas distintas.

> **Importante sobre seguridad:** separar el panel en otro HTML no protege por sí solo el acceso. La autenticación del docente y los permisos de datos se aplican con Supabase Auth y políticas RLS.

## Activar práctica en tiempo real con Supabase

La integración está preparada, pero hace falta crear el proyecto y configurarlo para que pueda conectarse:

1. Crea un proyecto en [Supabase](https://supabase.com/dashboard/).
2. En **Authentication → Sign In / Providers**, activa **Anonymous Sign-Ins** para estudiantes. Mantén también el proveedor **Email** activado para el docente.
3. En **Authentication → Users**, crea/invita la cuenta del docente. Copia su correo real para usarlo en el paso 5.
4. Abre **SQL Editor** y ejecuta `supabase/schema.sql`. El correo docente ya debe coincidir con `teacherEmail` en `js/core/supabase-config.js`; si lo cambias, actualiza también las políticas del SQL antes de ejecutarlo. Esto crea las tablas, políticas RLS y la publicación Realtime.
5. En **Project Settings → API**, copia **Project URL** y la clave pública **anon** (o **publishable**) en `js/core/supabase-config.js`; verifica que `teacherEmail` sea el correo de la cuenta docente.
6. Nunca pongas la clave `service_role` en el navegador ni la publiques. El sitio solo debe usar la clave `anon`/`publishable`; las políticas RLS protegen las tablas.
7. Publica el proyecto en Vercel y prueba con dos navegadores/dispositivos: inicia la práctica desde el panel docente y entra al laboratorio como estudiante.

El panel docente puede iniciar o pausar una sesión, observar conexiones y avances por proyecto, buscar estudiantes, filtrar por conexión, ayuda y nivel de progreso, editar el nombre mostrado y responder solicitudes de ayuda. Los gráficos de barras muestran el promedio de misiones completadas y cuántos estudiantes terminaron cada subsesión; se actualizan con los cambios recibidos por Supabase Realtime. La actividad reciente muestra hasta 12 de las últimas 20 misiones reportadas por las cuentas de estudiante, con hora, estudiante y subsesión. El botón **Exportar CSV** descarga el avance de la sesión y subsesión seleccionadas para todo el roster. En la Sesión 1 puede habilitar todas las subsesiones o asignar un solo proyecto; cuando asigna uno, el estudiante queda limitado a ese proyecto durante la práctica. En otras sesiones sin proyectos separados, se habilita la sesión completa. El editor del estudiante se desbloquea al iniciar la sesión. Supabase Realtime publica cambios de clase, progreso, solicitudes y eventos recientes; Presence señala quién está conectado y permite que el lobby muestre avatares y nombres de los compañeros conectados, sin habilitar chat entre estudiantes. Los registros de misión son reportados por el cliente y sirven para observación formativa; no son calificaciones verificadas ni prueba contra manipulación. Las cuentas anónimas no se borran ni bloquean desde el navegador; esas acciones requieren una función administrativa protegida en servidor.

El estudiante entra con autenticación anónima de Supabase; el navegador conserva la sesión para que pueda volver a su cuenta en ese mismo navegador sin contraseña y mantener su progreso. Si borra los datos del navegador o cambia de dispositivo, esa cuenta anónima no se puede recuperar con este método. Los avatares combinan una cabeza DiceBear con un cuerpo 2D generado localmente (ropa, brazos, piernas y calzado) cuyos colores se mantienen estables para cada semilla. Al cargar la cabeza, el navegador contacta `api.dicebear.com`; si el servicio no responde, se muestra un rostro ilustrado local de respaldo. El estudiante puede cambiar estilo o regenerar su avatar desde el laboratorio. El lobby muestra únicamente compañeros conectados mediante Presence; no ofrece chat directo entre estudiantes. Para pedir intervención, el estudiante puede contactar al docente y este responde o cierra la solicitud desde el panel. Cada misión completada suma 10 puntos y estos se calculan en el navegador a partir del progreso sincronizado; no son una puntuación antifraude. Para puntuaciones certificadas haría falta validar el trabajo en un servidor.

Después de entrar, si el docente todavía no inició la práctica, el estudiante pasa a una pantalla de lobby independiente con su avatar, una cuadrícula de compañeros conectados y acceso para pedir ayuda al docente. La lista se adapta a móvil y puede desplazarse si el grupo es numeroso. El editor y las misiones aparecen automáticamente al iniciar; al pausar la práctica, vuelve a la sala de espera.

Si ya ejecutaste anteriormente `supabase/schema.sql`, vuelve a ejecutarlo después de actualizar el proyecto para agregar la columna `project_id` al control de clase, ampliar el campo `avatar` para las semillas DiceBear y crear la tabla RLS `mission_completions` y su suscripción Realtime.

La Sesión 1 ofrece cuatro proyectos de dificultad creciente: primera página, portada, tarea escolar y currículum. Cada proyecto tiene misiones y progreso guardados por separado. La Sesión 2 ofrece cuatro subsesiones CSS en orden de dificultad: primeros colores, tipografía, tarjetas y espacios, e interacción con diseño adaptable; también guarda el avance de cada una por separado. En la vista previa, los enlaces HTTP/HTTPS se abren en otra pestaña y los enlaces de video de YouTube reconocidos (`watch`, `youtu.be`, `embed`, `shorts` y `live`) muestran un reproductor insertado. El navegador debe poder acceder a internet para cargar contenido externo; YouTube puede bloquear la inserción si la página se abre como `file://`, por lo que se debe usar un servidor local o abrir el video directamente en YouTube. En el editor se pueden expandir abreviaturas HTML con **Tab**: `h1`, `p`, `section`, `ul>li*3` o `!` para una página HTML inicial. En pantallas pequeñas, los botones Editor, Vista previa y Misiones permiten alternar entre las áreas del laboratorio. El contenido de sesiones y misiones del panel del estudiante se puede contraer para ampliar el área de trabajo; en escritorio, el separador entre editor y vista previa se ajusta arrastrándolo o con las flechas del teclado.

La URL del proyecto y la clave pública identifican la conexión web, pero no reemplazan el control de acceso. Las políticas RLS son indispensables y deben ejecutarse antes de usar la aplicación.

## Pendientes antes de producción con estudiantes

- Ejecuta `supabase/schema.sql` y valida acceso docente, registro anónimo, lectura/escritura permitida por RLS, presencia y eventos Realtime con dos cuentas estudiantiles de prueba. No consideres el indicador del panel como prueba de que se recibió un evento hasta completar esa prueba en el proyecto desplegado.
- El progreso y el historial son autoinformados por el navegador. No los uses para notas oficiales. Para evaluación certificada, implementa validación del trabajo y autorización de escritura en un backend/Edge Function; no basta con la autenticación ni con RLS de fila.
- Las cuentas anónimas solo se recuperan en el mismo navegador mientras su almacenamiento de sesión exista. No se agregó recuperación entre dispositivos, porque eso requiere elegir un mecanismo de vinculación de identidad apropiado para menores y definir su política de privacidad.
- Define retención y eliminación de perfiles, progreso, solicitudes y eventos; informa a estudiantes y responsables qué datos se recogen y quién puede verlos. Los registros `mission_completions` no incluyen el contenido de los proyectos.
- No implementes bloqueo o borrado de usuarios desde el cliente. Si se necesitan, usa una Edge Function protegida con autorización docente explícita y un registro de auditoría.
- Ejecuta `npm test` antes de publicar para validar el cálculo del avance y la exportación CSV. Las pruebas cubren funciones puras; aún hace falta añadir pruebas de integración con Supabase y un proceso de despliegue reproducible. En el estado actual, los módulos se cargan directamente en el navegador y Tailwind CSS procede de CDN.

## Estado de la refactorización

El currículo, los estilos y la lógica están separados en módulos. La conexión Supabase está implementada, pero no funcionará hasta completar la configuración del proyecto y ejecutar el SQL siguiendo los pasos anteriores.

## Identidad visual

El laboratorio y el panel docente comparten una interfaz clara con fondos suaves, superficies blancas y acentos índigo, menta y coral para diferenciar acciones, progreso y estados. El editor conserva su tema oscuro para facilitar la lectura del código. Los controles mantienen estados visibles de foco, interacción y desactivación, con ajustes específicos para pantallas móviles.