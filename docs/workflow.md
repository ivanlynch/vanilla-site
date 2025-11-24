# Development Workflow

Esta guía describe el flujo de trabajo de desarrollo para el proyecto **vanilla-site**.

## 🚀 Quick Start

### Instalación
```bash
# Clonar el repositorio
git clone https://github.com/ivanlynch/vanilla-site.git
cd vanilla-site

# Instalar dependencias (si las hay)
npm install
```

### Comandos Disponibles

```bash
# Construir el sitio estático
npm run build

# Iniciar servidor de desarrollo
npm run dev
```

## 📂 Estructura de Trabajo

### Directorio `src/`
Aquí trabajas en el código fuente:
- `src/components/` - Componentes HTML reutilizables (header, footer)
- `src/pages/` - Contenido de páginas individuales
- `src/styles.css` - Estilos globales
- `src/index.html` - Template base para todas las páginas
- `src/assets/` - Recursos estáticos (fuentes, imágenes, favicon)

### Directorio `dist/`
**No editar manualmente**. Este directorio se genera automáticamente con `npm run build`.

## 🔨 Flujo de Desarrollo

### 1. Editar Componentes o Páginas

**Para modificar componentes comunes:**
```bash
# Editar header de todas las páginas
src/components/header.html

# Editar footer de todas las páginas
src/components/footer.html
```

**Para modificar contenido de páginas:**
```bash
# Editar página home
src/pages/home.html

# Editar página about
src/pages/about.html
```

### 2. Editar Estilos

Todos los estilos están en:
```bash
src/styles.css
```

El archivo usa **CSS Layers** para organización:
- `@layer reset` - Reset CSS
- `@layer base` - Variables y estilos base
- `@layer components` - Componentes específicos

### 3. Build del Sitio

Después de hacer cambios, ejecuta el build:
```bash
npm run build
```

Este comando:
1. Limpia el directorio `dist/`
2. Lee el template `src/index.html`
3. Reemplaza placeholders `<!-- components/header -->` con el contenido real
4. Genera archivos HTML completos en `dist/`
5. Copia assets, CSS y JS a `dist/`

**Salida:**
```
dist/
├── index.html       # Home page
├── about.html       # About page
├── styles.css       # Estilos
├── index.js         # JavaScript
└── assets/          # Assets copiados
```

### 4. Preview Local

```bash
npm run dev
```

Esto inicia un servidor local en **http://localhost:3000** sirviendo los archivos de `dist/`.

**Importante:** Siempre ejecuta `npm run build` antes de `npm run dev` para ver tus cambios más recientes.

## 📝 Crear una Nueva Página

### 1. Crear el archivo de contenido
```bash
src/pages/mi-nueva-pagina.html
```

```html
<section id="mi-nueva-pagina" class="page">
  <h1>Título de la Página</h1>
  <p>Contenido aquí...</p>
</section>
```

### 2. Ejecutar build
```bash
npm run build
```

El build script automáticamente:
- Detecta el nuevo archivo en `src/pages/`
- Genera `dist/mi-nueva-pagina.html` con header y footer incluidos

### 3. Actualizar navegación (opcional)

Si quieres agregar la página al menú de navegación:
```bash
src/components/header.html
```

```html
<nav>
  <ul>
    <li><a href="index.html">Home</a></li>
    <li><a href="about.html">About</a></li>
    <li><a href="mi-nueva-pagina.html">Mi Nueva Página</a></li>
  </ul>
</nav>
```

## 🎨 Modificar Estilos

### Variables CSS

Las variables globales están en `src/styles.css` dentro de `:root`:
```css
:root {
  --color-bg: #0a0a0a;
  --color-fg: #ededed;
  --text-xl: 1.25rem;
  --spacing-4: 1rem;
}
```

### Agregar Estilos de Componente

Agrega estilos dentro del `@layer components`:
```css
@layer components {
  .mi-componente {
    color: var(--color-accent-500);
    padding: var(--spacing-4);
  }
}
```

## 🧪 Testing & Preview

### Verificar Cambios

1. Haz tus cambios en `src/`
2. Ejecuta `npm run build`
3. Ejecuta `npm run dev`
4. Abre http://localhost:3000
5. Verifica los cambios en el navegador

### Verificar HTML Generado

Revisa los archivos en `dist/` para asegurarte de que los componentes se inyectaron correctamente.

## 🔧 Tips & Troubleshooting

### El servidor dev no inicia (EADDRINUSE)

El puerto 3000 ya está ocupado. Termina el proceso anterior:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <process_id> /F

# O simplemente cierra la terminal anterior y abre una nueva
```

### Los cambios no se reflejan

Recuerda siempre ejecutar `npm run build` antes de `npm run dev`:
```bash
npm run build && npm run dev
```

### Placeholders no se reemplazan

Verifica que el placeholder en `src/index.html` coincida con el nombre del archivo:
```html
<!-- Correcto -->
<!-- components/header -->  → src/components/header.html
<!-- pages/home -->         → src/pages/home.html

<!-- Incorrecto -->
<!-- header -->             → No encontrará el archivo
```

## 📦 Deploy

Para hacer deploy del sitio:

1. Ejecuta el build de producción:
```bash
npm run build
```

2. Despliega el directorio `dist/` a tu hosting:
   - **Netlify**: Arrastra `dist/` o conecta el repo
   - **Vercel**: Conecta el repo, configura `dist/` como output
   - **GitHub Pages**: Usa GitHub Actions para copiar `dist/` a `gh-pages` branch

## 🗂️ .gitignore

El proyecto ignora:
```
node_modules/
.idea/
dist/
**/*Zone.Identifier
```

**Importante:** `dist/` NO se sube al repositorio porque es generado automáticamente.

## 🔄 Git Workflow

```bash
# 1. Hacer cambios en src/
# 2. Build y test local
npm run build
npm run dev

# 3. Commit
git add src/
git commit -m "feat: descripción del cambio"

# 4. Push
git push origin main

# 5. El CI/CD automáticamente ejecutará npm run build y desplegará dist/
```
