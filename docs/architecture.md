# Architecture Overview
Este documento describe la arquitectura del proyecto **vanilla-site**, un sitio web personal construido con tecnologías web nativas (HTML, CSS, JavaScript) sin frameworks. Este documento debe actualizarse a medida que el proyecto evoluciona.

## 1. Project Structure
El proyecto sigue una estructura simple y organizada, con todo el código fuente dentro del directorio `src/` para mejor organización.

```
vanilla-site/
├── docs/                 # Documentación del proyecto
│   └── architecture.md   # Este documento (arquitectura del proyecto)
├── src/                  # Código fuente de la aplicación
│   ├── assets/           # Recursos estáticos
│   │   ├── fonts/        # Fuentes personalizadas (Righteous, Merriweather)
│   │   └── favicon.ico   # Ícono del sitio
│   ├── index.html        # Punto de entrada principal de la aplicación
│   ├── styles.css        # Estilos globales con CSS Layers
│   └── index.js          # Lógica JavaScript del sitio
├── README.md             # Documentación principal del proyecto
└── .gitignore            # Archivos ignorados por Git
```

## 2. High-Level System Diagram

Este es un sitio web estático del lado del cliente sin backend:

```
[User Browser] <--> [src/index.html + src/styles.css + src/index.js]
                         |
                         +--> [Static Assets: src/assets/fonts, src/assets/favicon]
```

## 3. Core Components

### 3.1. Frontend

**Name**: Vanilla Site - Personal Website

**Description**: Sitio web personal de portafolio para Iván Lynch, que incluye secciones de Home, About, Post y Blog. El sitio presenta información profesional y está diseñado con un enfoque mobile-first.

**Technologies**: 
- HTML5 (estructura semántica)
- CSS3 con CSS Layers (@layer reset, @layer base)
- JavaScript puro (Vanilla JS)
- Custom fonts: Righteous (logo), Merriweather (headings y body)

**Deployment**: Estático - puede desplegarse en cualquier servicio de hosting estático (Vercel, Netlify, GitHub Pages, etc.)

**Design Philosophy**: 
- Mobile-first approach
- Sin frameworks ni dependencias
- Aprovecha las capacidades nativas de los navegadores modernos
- CSS modular usando CSS Layers para mejor organización

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

## 9. Future Considerations / Roadmap

- **Componentización**: Modularizar JavaScript en componentes reutilizables dentro de `src/`
- **Contenido dinámico**: Integración con un CMS headless o API para blog posts
- **Performance**: Implementar lazy loading para imágenes y recursos
- **PWA**: Convertir el sitio en Progressive Web App con Service Workers
- **Testing**: Agregar testing automatizado (Playwright, Vitest)
- **Build tooling**: Considerar bundling mínimo para optimización (sin comprometer la filosofía vanilla)

## 10. Project Identification

**Project Name**: vanilla-site

**Repository URL**: Local development (no URL pública aún)

**Primary Contact**: Iván Lynch (@ilynch)

**Original Site**: https://www.ilynch.dev (versión Next.js)

**Migration Goal**: Migrar de Next.js a vanilla JavaScript para reducir complejidad y aprovechar capacidades nativas de navegadores modernos

**Date of Last Update**: 2025-11-22

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

**Vanilla JS**: JavaScript puro sin frameworks o librerías externas

**CSS Layers**: Característica moderna de CSS que permite organizar estilos en capas con prioridades explícitas

**Mobile-first**: Estrategia de diseño que prioriza la experiencia móvil antes que desktop

**WOFF/WOFF2**: Web Open Font Format - formatos optimizados para fuentes web