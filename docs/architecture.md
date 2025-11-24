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
│   ├── components/       # Componentes HTML reutilizables
│   │   ├── header.html   # Header con navegación
│   │   └── footer.html   # Footer del sitio
│   ├── pages/            # Páginas adicionales del sitio
│   ├── scripts/          # Scripts JavaScript
│   │   └── components.js # Utilidad de carga de componentes
│   ├── index.html        # Página principal
│   ├── styles.css        # Estilos globales
│   └── index.js          # JavaScript principal
├── README.md             # Documentación del proyecto
└── .gitignore            # Archivos ignorados por Git
```

## Component System

### Arquitectura de Componentes

Para mantener el código DRY (Don't Repeat Yourself) sin afectar el SEO, el proyecto utiliza un sistema de componentes basado en **placeholders HTML** y un **build script**.

#### Funcionamiento:

1. **Componentes Reutilizables** (`src/components/`)
   - `header.html`: Header con navegación principal
   - `footer.html`: Footer común del sitio

2. **Placeholders en páginas**
   ```html
   <!-- #header -->
   <main>
     <!-- Contenido de la página -->
   </main>
   <!-- #footer -->
   ```

3. **Build Script** (próximamente)
   - Lee los archivos de componentes
   - Reemplaza los placeholders `<!-- #component-name -->` con el HTML real
   - Genera archivos HTML estáticos completos en `dist/`
   - **Resultado**: HTML puro optimizado para SEO, sin JavaScript de carga dinámica

### Ventajas de este enfoque:

✅ **SEO-friendly**: HTML estático completo en cada página  
✅ **DRY**: Componentes definidos una sola vez  
✅ **Sin JavaScript requerido**: Funciona sin JS habilitado  
✅ **Performance**: No hay carga asíncrona de componentes  
✅ **Mantenibilidad**: Cambios en header/footer se propagan automáticamente

## Frontend Stack

- **HTML5**: Estructura semántica
- **CSS3**: Con CSS Layers para organización modular
- **JavaScript**: Vanilla JS puro, sin frameworks
- **Fonts**: 
  - Righteous Regular (títulos)
  - Merriweather Regular y Bold (texto)

## Design Principles

- **Mobile-first approach**: Diseño responsive con viewport meta tag
- **Vanilla (sin frameworks)**: HTML, CSS y JavaScript nativos
- **SEO-first**: Contenido en HTML estático, no generado por JavaScript
- **Progressive Enhancement**: JavaScript mejora la experiencia pero no es requerido
- **Component-based**: Reutilización de código mediante componentes sin afectar SEO