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

El panel docente puede iniciar o pausar una sesión, observar conexiones y avances por proyecto, y responder solicitudes de ayuda. En la Sesión 1 puede habilitar todas las subsesiones o asignar un solo proyecto; cuando asigna uno, el estudiante queda limitado a ese proyecto durante la práctica. En otras sesiones sin proyectos separados, se habilita la sesión completa. El editor del estudiante se desbloquea al iniciar la sesión. Supabase Realtime publica cambios de clase, progreso y solicitudes; Presence señala quién está conectado y permite que el lobby muestre avatares y nombres de los compañeros conectados, sin habilitar chat entre estudiantes. El docente puede supervisar el roster y atender solicitudes desde su panel.

El estudiante entra con autenticación anónima de Supabase; el navegador conserva la sesión para que pueda volver a su cuenta en ese mismo navegador sin contraseña y mantener su progreso. Si borra los datos del navegador o cambia de dispositivo, esa cuenta anónima no se puede recuperar con este método. Los avatares 2D usan DiceBear con una semilla aleatoria no derivada del nombre ni del correo. Al cargar el SVG, el navegador contacta `api.dicebear.com`; si el servicio no responde, se muestra un avatar ilustrado local de respaldo. El estudiante puede cambiar estilo o regenerar su avatar desde el laboratorio. El lobby muestra únicamente compañeros conectados mediante Presence; no ofrece chat directo entre estudiantes. Para pedir intervención, el estudiante puede contactar al docente y este responde o cierra la solicitud desde el panel. Cada misión completada suma 10 puntos y estos se calculan en el navegador a partir del progreso sincronizado; no son una puntuación antifraude. Para puntuaciones certificadas haría falta validar el trabajo en un servidor.

Si ya ejecutaste anteriormente `supabase/schema.sql`, vuelve a ejecutarlo después de actualizar el proyecto para agregar la columna `project_id` al control de clase y ampliar el campo `avatar` para las semillas DiceBear.

La Sesión 1 ofrece cuatro proyectos de dificultad creciente: primera página, portada, tarea escolar y currículum. Cada proyecto tiene misiones y progreso guardados por separado. La Sesión 2 guía cinco retos de CSS: color del título, fondo, tipografía, tarjeta y estado hover del enlace. En el editor se pueden expandir abreviaturas HTML con **Tab**: `h1`, `p`, `section`, `ul>li*3` o `!` para una página HTML inicial. En pantallas pequeñas, los botones Editor, Vista previa y Misiones permiten alternar entre las áreas del laboratorio.

La URL del proyecto y la clave pública identifican la conexión web, pero no reemplazan el control de acceso. Las políticas RLS son indispensables y deben ejecutarse antes de usar la aplicación.

## Estado de la refactorización

El currículo, los estilos y la lógica están separados en módulos. La conexión Supabase está implementada, pero no funcionará hasta completar la configuración del proyecto y ejecutar el SQL siguiendo los pasos anteriores.