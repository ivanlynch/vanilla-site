# Styles Guide

Este documento describe la organización y el sistema de estilos del proyecto vanilla-site.

## CSS Architecture

El proyecto usa **CSS Layers** para organizar estilos en capas con prioridades explícitas:

```css
@layer reset {
  /* Reset/normalize CSS */
}

@layer base {
  /* Estilos base y design tokens */
}
```

## Typography System

### Font Families

```css
--ff-logo: "Righteous", sans-serif;
--ff-heading: "Merriweather Bold", sans-serif;
--ff-body: "Merriweather Regular", sans-serif;
```

**Fuentes disponibles:**
- **Righteous Regular** - Para logos
- **Merriweather Regular** - Para texto de cuerpo
- **Merriweather Bold** - Para títulos y headings

**Formatos de fuente:** WOFF2 (principal) y WOFF (fallback)

**Loading strategy:** `font-display: swap`

### Font Scale

Sistema de escala tipográfica basado en custom properties:

```css
--fs-300: 0.875rem;   /* 14px */
--fs-400: 1rem;       /* 16px */
--fs-500: 1.125rem;   /* 18px */
--fs-600: 1.25rem;    /* 20px */
--fs-700: 1.5rem;     /* 24px */
--fs-800: 2rem;       /* 32px */
--fs-900: 3.75rem;    /* 60px */
--fs-1000: 3.75rem;   /* 60px */
```

### Typography Tokens

```css
--font-size-heading-regular: var(--fs-800);  /* 2rem */
--font-size-body-regular: var(--fs-500);     /* 1.125rem */
```

### Heading Styles

```css
h1 {
  font-family: var(--ff-heading);
  font-size: var(--fs-900);      /* 3.75rem */
  margin-bottom: 1rem;
}

h2 {
  font-family: var(--ff-heading);
  font-size: var(--fs-800);      /* 2rem */
  margin-bottom: 0.75rem;
}

h3 {
  font-family: var(--ff-heading);
  font-size: var(--fs-700);      /* 1.5rem */
  margin-bottom: 0.5rem;
}

h4 {
  font-family: var(--ff-heading);
  font-size: var(--fs-600);      /* 1.25rem */
  margin-bottom: 0.5rem;
}
```

### Body Styles

```css
body {
  font-family: var(--ff-body);
  font-size: var(--font-size-body-regular);  /* 1.125rem */
}
```

## Reset Layer

El layer `reset` incluye:

- **Box-sizing**: `border-box` para todos los elementos
- **Text size adjust**: Deshabilitado para control preciso de tipografía
- **Margins**: Reset a 0 para body, headings y elementos de texto
- **Line height**: 
  - `1.6` para body
  - `1.1` para headings, buttons e inputs
- **Text wrap**:
  - `balance` para headings (h1-h4)
  - `pretty` para párrafos y list items
- **Images**: `max-inline-size: 100%` y `display: block`
- **Form elements**: Heredan fuente del parent

## Usage Guidelines

### Usando la escala tipográfica

```css
/* Correcto - usa las custom properties */
.my-component {
  font-size: var(--fs-500);
}

/* Evitar - no usar valores hardcoded */
.my-component {
  font-size: 1.125rem;
}
```

### Usando las fuentes

```css
/* Para logos */
.logo {
  font-family: var(--ff-logo);
}

/* Para headings */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--ff-heading);
}

/* Para body text */
body, p, li {
  font-family: var(--ff-body);
}
```

## File Structure

```
src/
├── styles.css           # Archivo principal de estilos
└── assets/
    └── fonts/          # Fuentes web
        ├── Righteous Regular.woff2
        ├── Righteous Regular.woff
        ├── Merriweather Regular.woff2
        ├── Merriweather Regular.woff
        ├── Merriweather Bold.woff2
        └── Merriweather Bold.woff
```
