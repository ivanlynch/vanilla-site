# ¿Qué es este proyecto?

Esta es la versión sin frameworks de mi sitio web que actualmente está publicado en https://www.ilynch.dev. La idea de este proyecto es migrar mi sitio web que actualmente usa Next.js a un proyecto puro que solo usa HTML, CSS y JavaScript.


# ¿Cuál es la motivación de hacer este proyecto usando JavaScript puro?

Hoy en día, las diferentes implementaciones de JavaScript en los browsers (Spidermonkey, v8, etc) son practicamente similares y ya practicamente no hay diferencias significativas entre ellas. Lo que hace que no tenga mucho sentido usar un framework para construir un sitio web moderno y también creo que no usar frameworks también va a reducir la complejidad del proyecto y hacerlo mas facil de mantener.

## ¿Qué tecnologías usa este proyecto?

- **HTML5**: Estructura semántica con componentes reutilizables
- **CSS3**: Con CSS Layers, Custom Properties y optimización automática
- **JavaScript**: Vanilla JS puro, sin frameworks
- **Build Tools**: 
  - PurgeCSS para optimización de CSS
  - html-minifier-terser para minificación de HTML
  - sharp para optimización de imágenes responsive
  - File watching para desarrollo con reconstrucción automática