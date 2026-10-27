# Revisión docente de las sesiones 1 y 2

Revisión del código local, 26 de octubre de 2026. Esta nota actualiza la metodología de los documentos anteriores; los cambios se implementan en las sesiones del laboratorio.

## Valoración

La base es adecuada: propósitos, productos, criterios, actividades contextualizadas, pistas y preguntas de cierre. La dificultad estaba en la autonomía: varias tareas de HTML consistían en modificar contenido de una plantilla. En CSS se entregaba una clase sin construir antes su significado. El progreso automático verifica condiciones del código, pero no demuestra comprensión ni autoría.

## Sesión 1: observar, explicar y construir

Cada subsesión tiene un ejemplo completo separado del editor. El estudiante identifica etiquetas y resultado, explica una de ellas y pulsa «Ocultar ejemplo y empezar desde cero». El modelo desaparece y escribe su solución en blanco con pistas progresivas. El ejemplo nunca se evalúa ni se copia automáticamente al trabajo. Cada subsesión mantiene su propio código.

Los trabajos anteriores se recuperan sin borrarlos. Para repetir una actividad existente desde cero, usar Reiniciar: solicita confirmación y borra el código y progreso de esa subsesión. No elimina los demás trabajos.

El editor trabaja con el contenido de una página; el laboratorio genera la estructura exterior al descargar. Construir desde cero aquí no significa que ya se haya enseñado DOCTYPE, html, head y body. Explicarlo al grupo y enseñar esa estructura en una actividad posterior.

## Sesión 2: secuencia explícita

1. Leer el HTML base sin estilos: localizar título, párrafos y article. Explicar que article agrupa contenido y div es otro contenedor genérico.
2. Escribir la apertura y cierre de style debajo de main. Dejar el HTML fuera del bloque.
3. Dentro de style, escribir `h1 { color: purple; }`. Identificar selector, llaves, propiedad, dos puntos, valor y punto y coma. Predecir y observar el resultado.
4. Escribir una regla para p y observar que afecta a todos los párrafos. Cambiar el fondo de body y comprobar legibilidad.
5. Trabajar tipografía conservando el código anterior.
6. Localizar article y agregar `class="tarjeta"`. Dentro de style escribir `.tarjeta { border: 2px solid blue; }`. Comparar el nombre sin punto en HTML con el selector con punto en CSS.
7. Añadir padding y margin de uno en uno; explicar qué espacio cambió. Continuar con esquinas y sombra.
8. Interacción y adaptación a celular quedan como reto de ampliación.

En CSS se conserva la base HTML porque el objetivo nuevo es construir las reglas, no repetir toda la sesión 1. Si se entra directamente en una subsesión posterior sin trabajo previo, se recibe esa base sin CSS: repasar primero los pasos 2 y 6 cuando corresponda.

## Dinámica y evaluación sugeridas

Para 90 minutos: 10 de activación, 10 de modelado dialogado, 55 de práctica con pausas para comparar resultados y 15 de revisión y cierre. Son tiempos propuestos: ajustarlos al ritmo observado. Los retos no deben ser obligatorios para terminar la clase.

Antes de dar por logrado el aprendizaje, pedir tres evidencias:

- Construcción: escribir una etiqueta o regla sin copiar el modelo completo.
- Explicación: señalar qué elemento selecciona una regla y justificar una propiedad.
- Transferencia: usar otro tema en HTML; en CSS renombrar tarjeta como ficha tanto en HTML como en CSS y explicar por qué deben coincidir. Esta variante se revisa oralmente o en una copia descargada, pues las misiones automáticas esperan tarjeta.

En parejas, uno predice y otro escribe; después intercambian roles. Para depurar, retirar temporalmente el punto de .tarjeta y explicar por qué deja de aplicarse. No exigir velocidad ni memorizar códigos de colores.

## Límites de la revisión

Las comprobaciones automáticas son ayudas parciales: no califican la calidad del resumen, la pertinencia del alt, el contraste real ni la comprensión. El navegador también puede corregir etiquetas mal cerradas. El docente debe revisar estos aspectos y escuchar la explicación del estudiante. No se verificó una clase real ni la sincronización con Supabase en producción.


## Aplicación de la revisión formativa

Las ocho subsesiones incluyen ahora «Demuestra lo que aprendiste»: explicación, corrección de un error y una variante. El bloque está disponible durante el trabajo y se abre al completar las comprobaciones. No otorga aprobación ni puntos automáticos y no almacena respuestas. Consultar GUIA_PRIMERA_CLASE.md para el guion dirigido a 3.º–5.º de secundaria.
