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
└── 📂 js/
    ├── 📂 core/
    │   ├── 📄 app.js                 # Controlador principal
    │   ├── 📄 editor.js              # CodeMirror y redimensionador
    │   ├── 📄 db.js                  # Persistencia local (LocalStorage)
    │   ├── 📄 parser.js              # Análisis del HTML para validaciones
    │   └── 📄 teacher.js             # Lógica del panel docente
    └── 📂 sesiones/
        ├── 📄 sesion1.js             # Misiones de HTML básico
        ├── 📄 sesion2.js             # Misiones de CSS básico
        └── 📄 index.js               # Catálogo y carga bajo demanda
```

## 🧠 ¿Cómo funcionará esta nueva arquitectura?

1. **Desacoplamiento del Currículo:** El contenido y las validaciones están fuera del HTML. Para agregar una sesión, crea su archivo en `js/sesiones/` y registra su ruta y título en `js/sesiones/index.js`.
2. **Carga Perezosa (Lazy Loading):** El navegador carga el archivo de una sesión cuando se selecciona por primera vez.
3. **Separación de responsabilidades:** Los estilos, el editor, el analizador, la persistencia y la interfaz docente tienen archivos separados. El laboratorio y el panel docente son páginas distintas.

> **Importante sobre seguridad:** separar el panel en otro HTML solo separa la interfaz. Una contraseña guardada en JavaScript y los datos en LocalStorage pueden inspeccionarse o modificarse desde el navegador. Para proteger el acceso docente y los datos se necesita autenticación y persistencia en un servidor (por ejemplo Firebase/Supabase con reglas de acceso); la contraseña actual solo sirve como demostración local.

## 🚀 Plan de Acción para la Refactorización

Para migrar a este nuevo modelo de manera ordenada, sugiero estos pasos:

*   **Paso 1:** Extraer todo el objeto `CURRICULUM` (las sesiones) a un formato independiente.
*   **Paso 2:** Separar la lógica de la Interfaz (CodeMirror, Resizer, Confeti).
*   **Paso 3:** Separar la lógica de la Base de Datos / Autenticación.