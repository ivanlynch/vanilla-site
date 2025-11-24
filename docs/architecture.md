# Architecture Overview
Este documento describe la arquitectura del proyecto **vanilla-site**, un sitio web personal construido con tecnologías web nativas (HTML, CSS, JavaScript) sin frameworks, siguiendo el patrón arquitectónico **MPA (Multi-Page Application)**. Este documento debe actualizarse a medida que el proyecto evoluciona.

## Patrón Arquitectónico: MPA (Multi-Page Application)

Este proyecto implementa una arquitectura **MPA vanilla** donde:
- Cada sección principal es una página HTML independiente
- La navegación entre páginas genera peticiones HTTP tradicionales
- El contenido está presente en el HTML inicial para optimal SEO
- JavaScript enriquece la experiencia pero no controla la navegación principal
- El routing es gestionado por el servidor/sistema de archivos, no por JavaScript

**Razones para elegir MPA:**
- ✅ SEO crítico - cada página es indexable directamente por buscadores
- ✅ Performance en primera carga - contenido visible inmediatamente
- ✅ Simplicidad - arquitectura más sencilla sin necesidad de router JS complejo
- ✅ Mobile-first - mejor rendimiento en dispositivos de gama media/baja
- ✅ Sin estado complejo - cada página maneja su propio contexto

## 1. Project Structure

El proyecto sigue una estructura MPA con páginas HTML independientes, organizado dentro del directorio `src/`. En el futuro, cada sección principal (Home, About, Blog, etc.) tendrá su propio archivo HTML.

```
vanilla-site/
├── docs/                 # Documentación del proyecto
│   ├── architecture.md   # Arquitectura del proyecto
│   └── guide.md          # Guía MPA vs SPA
├── src/                  # Código fuente de la aplicación (arquitectura MPA)
│   ├── assets/           # Recursos estáticos compartidos
│   │   ├── fonts/        # Fuentes personalizadas (Righteous, Merriweather)
│   │   └── favicon.ico   # Ícono del sitio
│   ├── styles/           # Estilos (futuro: CSS modular por página)
│   │   └── main.css      # Estilos globales compartidos
│   ├── scripts/          # JavaScript (futuro: módulos por página)
│   │   └── common.js     # Funcionalidad compartida
│   ├── index.html        # Página principal (Home)
│   ├── about.html        # Página About (futuro)
│   ├── blog.html         # Página Blog (futuro)
│   └── contact.html      # Página Contact (futuro)
├── README.md             # Documentación principal del proyecto
└── .gitignore            # Archivos ignorados por Git
```

**Estructura MPA actual vs futura:**
- **Actual (MVP)**: Una sola página `index.html` con todas las secciones
- **Futuro**: Páginas HTML separadas para cada sección principal

## 2. High-Level System Diagram

**Arquitectura MPA** - sitio web estático con múltiples páginas HTML:

```
[User Browser] <--> [index.html | about.html | blog.html | contact.html]
                         |
                         +--> [Shared Assets]
                         |      ├── styles/main.css (estilos globales)
                         |      ├── scripts/common.js (JS compartido)
                         |      └── assets/ (fonts, favicon)
                         |
                         +--> [Page-specific Assets]
                                ├── styles/home.css
                                ├── styles/blog.css
                                └── scripts/blog.js
```

**Flujo de navegación MPA:**
```
[Usuario en index.html]
        |
        v
[Click en link: <a href="about.html">]
        |
        v
[Navegador hace HTTP request a about.html]
        |
        v
[Servidor devuelve about.html completo]
        |
        v
[Navegador renderiza nueva página]
```

## 3. Core Components

### 3.1. Frontend

**Name**: Vanilla Site - Personal Website

**Description**: Sitio web personal de portafolio para Iván Lynch implementado como **MPA vanilla**. Incluye páginas separadas para Home, About, Blog y Contact. Cada página es un HTML independiente con contenido completo para optimal SEO. Diseñado con enfoque mobile-first.

**Technologies**: 
- HTML5 (estructura semántica)
- CSS3 con CSS Layers (@layer reset, @layer base)
- JavaScript puro (Vanilla JS)
- Custom fonts: Righteous (logo), Merriweather (headings y body)

**Deployment**: Estático - puede desplegarse en cualquier servicio de hosting estático (Vercel, Netlify, GitHub Pages, etc.)

**Architecture Pattern**: MPA (Multi-Page Application)

**Design Philosophy**: 
- **MPA vanilla** - páginas HTML independientes con navegación tradicional
- **Mobile-first approach** - diseño responsive priorizando dispositivos móviles
- **Sin frameworks** - HTML, CSS y JavaScript nativos solamente
- **SEO-first** - contenido presente en HTML inicial, no generado por JS
- **Progressive Enhancement** - JS enriquece la experiencia, no la controla
- **CSS modular** - CSS Layers + archivos específicos por página
- **Performance** - primera carga rápida, contenido visible inmediatamente

### 3.2. Backend Services

**N/A** - Este proyecto es completamente estático, sin servicios backend. Todo el contenido se renderiza del lado del cliente.

## 4. Data Stores

**N/A** - No utiliza bases de datos. Todo el contenido está incluido directamente en el HTML o será cargado dinámicamente mediante JavaScript en futuras iteraciones.

## 5. External Integrations / APIs

**Actualmente**: Ninguna integración externa.

**Futuras consideraciones**: Posibles integraciones con servicios de blog o CMS headless para contenido dinámico.

## 6. Deployment & Infrastructure

**Host Provider**: TBD (a determinar - candidatos: Vercel, Netlify, GitHub Pages)

**Build Process**: No requiere proceso de build - los archivos se sirven directamente desde `src/`

**CI/CD Pipeline**: No configurado actualmente

**Monitoring & Logging**: No aplicable para sitio estático

## 7. Security Considerations

**Authentication**: N/A - sitio público sin autenticación

**Authorization**: N/A - contenido completamente público

**Data Encryption**: HTTPS mediante el proveedor de hosting

**CSP (Content Security Policy)**: A implementar en futuras versiones

## 8. Development & Testing Environment

### Local Setup Instructions:
1. Clonar el repositorio
2. Abrir `src/index.html` en un navegador moderno, o
3. Usar un servidor local simple desde la raíz: `python -m http.server` o `npx serve`

**Testing Frameworks**: No implementado actualmente - se testea manualmente en navegadores

**Code Quality Tools**: A implementar (ESLint, Prettier para futuras versiones)

**Browser Support**: Navegadores modernos con soporte para:
- CSS Layers
- CSS Custom Properties
- Font loading API
- ES6+ JavaScript

## 9. Future Considerations / Roadmap (MPA Architecture)

### Fase 1: Separación de páginas
- **Separar secciones en páginas HTML independientes**:
  - `index.html` → Home
  - `about.html` → About
  - `blog.html` → Blog (con lista de posts)
  - `contact.html` → Contact
- **Crear estructura de estilos modular**:
  - `styles/main.css` → Estilos globales compartidos
  - `styles/home.css`, `styles/blog.css`, etc. → Estilos específicos por página
- **Crear módulos JS por página**:
  - `scripts/common.js` → Funcionalidad compartida
  - `scripts/blog.js`, `scripts/contact.js`, etc. → JS específico por página

### Fase 2: Componentes compartidos (MPA-friendly)
- **Componentes reutilizables** sin depender de frameworks:
  - Header/Navigation → incluido en cada HTML con Server-Side Includes o build step
  - Footer → compartido entre páginas
  - Web Components para elementos interactivos (opcional)
- **Navegación mejorada**:
  - Active states en navegación según página actual
  - Breadcrumbs para mejor UX

### Fase 3: Contenido y funcionalidad
- **Blog dinámico** con arquitectura MPA:
  - Página índice `blog.html` con lista de posts
  - Páginas individuales `blog/post-slug.html` para cada artículo
  - Metadata completa en cada HTML para SEO óptimo
- **CMS headless** (opcional):
  - Integración con CMS para gestión de contenido
  - Build-time generation de páginas desde el CMS

### Fase 4: Optimización y features avanzadas
- **Performance**:
  - Lazy loading de imágenes con `loading="lazy"`
  - Preload de fuentes y recursos críticos
  - Link prefetching para páginas relacionadas
- **PWA capabilities**:
  - Service Worker para caching de páginas visitadas
  - Offline support básico
  - Manifest para instalabilidad
- **Testing**:
  - Tests E2E con Playwright (navegación entre páginas)
  - Tests de accesibilidad
  - Lighthouse CI para performance tracking
- **Build tooling mínimo**:
  - Optimización de assets (minificación CSS/JS)
  - Procesamiento de imágenes
  - Sin comprometer la filosofía vanilla - solo optimizaciones

## 10. Project Identification

**Project Name**: vanilla-site

**Repository URL**: Local development (no URL pública aún)

**Primary Contact**: Iván Lynch (@ilynch)

**Original Site**: https://www.ilynch.dev (versión Next.js)

**Migration Goal**: Migrar de Next.js a vanilla JavaScript para reducir complejidad y aprovechar capacidades nativas de navegadores modernos

**Date of Last Update**: 2025-11-24

## 11. Design System

### Typography
- **Logo**: Righteous Regular
- **Headings**: Merriweather Bold
- **Body**: Merriweather Regular

### Font Scale
- `--fs-300`: 0.875rem
- `--fs-400`: 1rem
- `--fs-500`: 1.125rem (body regular)
- `--fs-600`: 1.25rem
- `--fs-700`: 1.5rem
- `--fs-800`: 2rem (h2)
- `--fs-900`: 3.75rem (h1)
- `--fs-1000`: 3.75rem

### CSS Architecture
El proyecto usa **CSS Layers** para organizar estilos en capas con prioridades bien definidas:
- `@layer reset`: Reset/normalize CSS
- `@layer base`: Estilos base y tokens de diseño (custom properties)

## 12. Glossary / Acronyms

**MPA (Multi-Page Application)**: Arquitectura web donde cada ruta corresponde a un documento HTML independiente, con navegación tradicional mediante peticiones HTTP

**SPA (Single-Page Application)**: Arquitectura web con un único HTML donde el routing es manejado por JavaScript

**Vanilla JS**: JavaScript puro sin frameworks o librerías externas

**CSS Layers**: Característica moderna de CSS que permite organizar estilos en capas con prioridades explícitas

**Mobile-first**: Estrategia de diseño que prioriza la experiencia móvil antes que desktop

**Progressive Enhancement**: Metodología de desarrollo que proporciona funcionalidad básica para todos, y mejoras progresivas para navegadores más capaces

**WOFF/WOFF2**: Web Open Font Format - formatos optimizados para fuentes web

**SSR (Server-Side Rendering)**: Renderizado del lado del servidor

**SEO (Search Engine Optimization)**: Optimización para motores de búsqueda