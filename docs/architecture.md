# Architecture Overview

Este documento describe la arquitectura del proyecto **vanilla-site**, un sitio web personal construido con tecnologías web nativas (HTML, CSS, JavaScript) sin frameworks, siguiendo el patrón arquitectónico **MPA (Multi-Page Application)**.

## Patrón Arquitectónico: MPA (Multi-Page Application)

Este proyecto implementa una arquitectura **MPA** donde:
- Cada sección principal es una página HTML independiente
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
│   ├── workflow.md       # Guía de flujo de trabajo
│   └── guidelines/       # Guías de desarrollo
│       └── styles.md     # Guía de estilos CSS
├── src/                  # Código fuente
│   ├── assets/           # Recursos estáticos
│   │   ├── fonts/        # Fuentes web (Righteous, Merriweather)
│   │   └── favicon.ico   # Ícono del sitio
│   ├── components/       # Componentes HTML reutilizables
│   │   ├── header.html   # Header con navegación
│   │   └── footer.html   # Footer del sitio
│   ├── pages/            # Páginas del sitio
│   │   ├── home.html     # Contenido de la página home
│   │   └── about.html    # Contenido de la página about
│   ├── scripts/          # Scripts de desarrollo
│   │   ├── build.js      # Script de build (CommonJS)
│   │   └── dev.mjs       # Servidor de desarrollo (ES Module)
│   ├── index.html        # Template base para todas las páginas
│   ├── styles.css        # Estilos globales con CSS Layers
│   └── index.js          # JavaScript principal
├── dist/                 # Salida del build (generado, no editar)
│   ├── index.html        # Home page (generado)
│   ├── about.html        # About page (generado)
│   ├── styles.css        # Estilos (copiado)
│   ├── index.js          # JavaScript (copiado)
│   └── assets/           # Assets (copiados)
├── package.json          # Configuración de npm
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

2. **Placeholders en template** (`src/index.html`)
   ```html
   <!-- components/header -->
   <main class="main">
     <!-- pages/home -->
   </main>
   <!-- components/footer -->
   ```

3. **Build Script** (`src/scripts/build.js`)
   - Lee el template `src/index.html`
   - Lee los archivos de componentes y páginas
   - Reemplaza los placeholders `<!-- path/to/file -->` con el contenido real del archivo HTML
   - Genera archivos HTML estáticos completos en `dist/`
   - Copia assets, CSS y JS a `dist/`
   - **Resultado**: HTML puro optimizado para SEO, sin JavaScript de carga dinámica

#### Ejecución:
```bash
npm run build
```

**Salida:**
- `dist/index.html` - Home page completa con header + home + footer
- `dist/about.html` - About page completa con header + about + footer
- Assets y estilos copiados a `dist/`

### Ventajas de este enfoque:

✅ **SEO-friendly**: HTML estático completo en cada página  
✅ **DRY**: Componentes definidos una sola vez  
✅ **Sin JavaScript requerido**: Funciona sin JS habilitado  
✅ **Performance**: No hay carga asíncrona de componentes  
✅ **Mantenibilidad**: Cambios en header/footer se propagan automáticamente

## Development Tools

El proyecto incluye scripts de desarrollo para facilitar el workflow:

### Build Script (`src/scripts/build.js`)
- **Lenguaje**: CommonJS (Node.js)
- **Función**: Genera HTML estático desde componentes
- **Comando**: `npm run build`

### Dev Server (`src/scripts/dev.mjs`)
- **Lenguaje**: ES Module (.mjs)
- **Función**: Servidor HTTP local para preview
- **Puerto**: 3000
- **Comando**: `npm run dev`
- **URL**: http://localhost:3000

**Configuración de módulos:**
```json
{
  "type": "commonjs"  // En package.json
}
```
- `build.js` usa CommonJS (`require`)
- `dev.mjs` usa ES modules (`import`) por extensión .mjs

## Frontend Stack

- **HTML5**: Estructura semántica con componentes reutilizables
- **CSS3**: 
  - CSS Layers (`@layer reset`, `@layer base`, `@layer components`)
  - CSS Custom Properties (variables)
  - Dark theme como default
- **JavaScript**: Vanilla JS puro, sin frameworks
- **Build**: Node.js con scripts personalizados
- **Fonts**: 
  - Righteous Regular (logo y headers)
  - Merriweather Regular y Bold (body text)

### Color Palette

```css
--color-bg: #0a0a0a;           /* Background oscuro */
--color-fg: #ededed;           /* Foreground claro */
--color-accent-500: #ff6b6b;   /* Color de acento (rojo/coral) */
```

### Typography Scale

```css
--text-sm: 0.875rem;      /* 14px */
--text-base: 1rem;        /* 16px */
--text-xl: 1.25rem;       /* 20px */
--text-6xl: 3.75rem;      /* 60px */
```

## Design Principles

- **Mobile-first approach**: Diseño responsive con viewport meta tag
- **Vanilla (sin frameworks)**: HTML, CSS y JavaScript nativos
- **SEO-first**: Contenido en HTML estático, no generado por JavaScript
- **Progressive Enhancement**: JavaScript mejora la experiencia pero no es requerido
- **Component-based**: Reutilización de código mediante componentes sin afectar SEO
- **Dark mode by default**: Tema oscuro como diseño principal
