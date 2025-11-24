# Architecture Overview

Este documento describe la arquitectura del proyecto **vanilla-site**, un sitio web personal construido con tecnologías web nativas (HTML, CSS, JavaScript) sin frameworks, siguiendo el patrón arquitectónico **MPA (Multi-Page Application)**.

## Patrón Arquitectónico: MPA (Multi-Page Application)

Este proyecto implementa una arquitectura **MPA** donde:
- Cada sección principal será una página HTML independiente
- La navegación entre páginas genera peticiones HTTP tradicionales
- El contenido está presente en el HTML inicial para optimal SEO
- JavaScript enriquece la experiencia pero no controla la navegación principal
- El routing es gestionado por el servidor/sistema de archivos, no por JavaScript

## Project Structure

Estructura de archivos actual del proyecto:

```
vanilla-site/
├── docs/                 # Documentación del proyecto
│   ├── architecture.md   # Este documento
│   └── guidelines/       # Guías de desarrollo
│       └── styles.md     # Guía de estilos CSS
├── src/                  # Código fuente
│   ├── assets/           # Recursos estáticos
│   │   ├── fonts/        # Fuentes web (Righteous, Merriweather)
│   │   └── favicon.ico   # Ícono del sitio
│   ├── index.html        # Página principal
│   ├── styles.css        # Estilos globales
│   └── index.js          # JavaScript principal
├── README.md             # Documentación del proyecto
└── .gitignore            # Archivos ignorados por Git
```

### Frontend
- **HTML5**: estructura semántica
- **CSS3**: con CSS Layers
- **JavaScript**: puro (Vanilla JS), sin frameworks
- **Fonts**: Righteous Regular, Merriweather Regular, Merriweather Bold

## Design Principles

- **Mobile-first approach**: Diseño responsive con viewport meta tag
- **Vanilla (sin frameworks)**: HTML, CSS y JavaScript nativos