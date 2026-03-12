---
name: tailwind-hsbc-design-system
description: Design system con Tailwind CSS v4 para proyectos HSBC: tokens de marca (rojo, negro, gris, blanco), componentes CVA, modales/ventanas emergentes coherentes con el fondo y accesibilidad. Usar al crear librerías de componentes, estandarizar UI o implementar diálogos/confirmaciones.
---

# Tailwind Design System HSBC (v4)

Sistema de diseño con Tailwind CSS v4 para proyectos HSBC: configuración CSS-first, tokens de marca (rojo, negro, gris, blanco), variantes de componentes, modales coherentes con el fondo y buenas prácticas de accesibilidad.

> **Nota**: Orientado a Tailwind CSS v4. Para v3, ver [guía de actualización](https://tailwindcss.com/docs/upgrade-guide).

## Cuándo usar esta skill

- Crear librería de componentes con Tailwind v4 en contexto HSBC
- Implementar tokens de diseño y temas con configuración CSS-first
- Construir componentes responsivos y accesibles
- Estandarizar patrones de UI (botones, cards, formularios, **modales/ventanas emergentes**)
- Configurar modales/diálogos con backdrop y estilo coherente con el fondo

## Colores de marca HSBC (predominantes)

| Uso        | Token / Variable     | Descripción              |
| ---------- | -------------------- | ------------------------ |
| Primario   | `--color-primary`    | Rojo HSBC #db0011        |
| Fondo oscuro | `--color-gray-dark` | Gris #404040             |
| Negro      | Negro para texto/UI  | Contraste y jerarquía    |
| Blanco     | Fondos y superficies  | Cards, modales, fondos   |
| Grises     | Escala de grises      | Bordes, muted, secundario|

## Cambios clave v4

| Patrón v3                          | Patrón v4                                                          |
| ---------------------------------- | ------------------------------------------------------------------- |
| `tailwind.config.ts`               | `@theme` en CSS                                                     |
| `@tailwind base/components/...`    | `@import "tailwindcss"`                                             |
| `darkMode: "class"`                | `@custom-variant dark (&:where(.dark, .dark *))`                     |
| `theme.extend.colors`              | `@theme { --color-*: value }`                                       |
| Plugins de animación               | `@keyframes` en `@theme` + `@starting-style` para entradas          |

## Quick Start – Tema HSBC

```css
/* app.css - Configuración Tailwind v4 con marca HSBC */
@import "tailwindcss";

@theme {
  /* Marca HSBC: rojo, negro, gris, blanco */
  --color-primary: #db0011;
  --color-primary-foreground: #ffffff;
  --color-primary-hover: #b8000e;

  --color-background: #ffffff;
  --color-foreground: #000000;

  --color-gray-dark: #404040;
  --color-muted: #6b7280;
  --color-muted-foreground: #9ca3af;

  --color-secondary: #f3f4f6;
  --color-secondary-foreground: #111827;

  --color-accent: #f3f4f6;
  --color-accent-foreground: #111827;

  --color-destructive: #db0011;
  --color-destructive-foreground: #ffffff;

  --color-border: #e5e7eb;
  --color-ring: #db0011;
  --color-ring-offset: #ffffff;

  --color-card: #ffffff;
  --color-card-foreground: #111827;

  /* Radios */
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;

  /* Animaciones */
  --animate-fade-in: fade-in 0.2s ease-out;
  --animate-fade-out: fade-out 0.2s ease-in;
  --animate-dialog-in: dialog-in 0.3s ease-out;
  --animate-dialog-out: dialog-out 0.2s ease-in;

  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes fade-out {
    from { opacity: 1; }
    to { opacity: 0; }
  }
  @keyframes dialog-in {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
  @keyframes dialog-out {
    from { opacity: 1; transform: scale(1); }
    to { opacity: 0; transform: scale(0.95); }
  }
}

@custom-variant dark (&:where(.dark, .dark *));

.dark {
  --color-background: #111827;
  --color-foreground: #f9fafb;
  --color-primary: #db0011;
  --color-border: #374151;
  --color-card: #1f2937;
}

@layer base {
  * { @apply border-border; }
  body { @apply bg-background text-foreground antialiased; }
}
```

## Modales / ventanas emergentes (coherentes con el fondo)

Patrón alineado con diálogos de confirmación: **backdrop** que integra con el fondo, **contenido** en blanco/gris claro y **botones** con paleta HSBC.

- **Backdrop**: oscuro semitransparente + blur para no "cortar" con el fondo.
- **Contenedor del diálogo**: fondo blanco, borde discreto (gris), sombra fuerte.
- **Header**: fondo gris muy claro o blanco; títulos en negro/gris oscuro.
- **Footer**: fondo gris claro (`bg-gray-50`); Cancelar = gris; Confirmar = primary (rojo HSBC).

```css
/* Opcional: utilidad para overlay de modales */
@utility modal-backdrop {
  @apply fixed inset-0 z-50 bg-gray-900/50 backdrop-blur-sm;
}

@utility modal-panel {
  @apply relative z-50 bg-white rounded-lg shadow-xl border border-border max-w-md w-full;
}
```

```jsx
// Patrón de estructura para modales (React) – coherente con ConfirmDialog
// Backdrop
<div
  className="fixed inset-0 z-50 flex items-center justify-center p-4"
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
>
  <div
    className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity duration-300"
    onClick={onClose}
    aria-hidden="true"
  />
  {/* Panel del modal */}
  <div
    className={cn(
      "relative bg-white rounded-lg shadow-xl border-2 border-gray-200 max-w-md w-full",
      "transform transition-all duration-300",
      isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
    )}
  >
    {/* Header - fondo gris muy claro, texto oscuro */}
    <div className="px-6 py-4 bg-gray-50 rounded-t-lg border-b border-gray-200">
      <h3 id="modal-title" className="text-lg font-semibold text-gray-900">
        {title}
      </h3>
    </div>
    <div className="px-6 py-4 text-gray-700">{children}</div>
    {/* Footer - Cancelar gris, Confirmar rojo HSBC */}
    <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end gap-3">
      <button
        type="button"
        onClick={onClose}
        className="px-4 py-2 rounded-md font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors"
      >
        Cancelar
      </button>
      <button
        type="button"
        onClick={onConfirm}
        className="px-4 py-2 rounded-md font-medium text-white bg-primary hover:bg-primary-hover transition-colors"
      >
        Confirmar
      </button>
    </div>
  </div>
</div>
```

- Usar **tokens del tema** (`bg-primary`, `text-gray-900`, `border-gray-200`) para que todos los modales compartan el mismo estilo.
- Para **warning/question**: mantener la misma estructura; variar solo color de borde/icono (por ejemplo borde gris para neutro, o acento rojo para destructivo), sin salirse de rojo/negro/gris/blanco.

## Conceptos clave

### Jerarquía de tokens

```
Marca HSBC (rojo, negro, gris, blanco)
    → Tokens semánticos (--color-primary, --color-background, …)
        → Clases de utilidad (bg-primary, text-foreground, …)
```

### Arquitectura de componentes

```
Estilos base → Variantes → Tamaños → Estados → Overrides
```

## Patrones de componentes

### Botón con CVA (variante primary HSBC)

```typescript
const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary-hover',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-border bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'size-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
);
```

### Card (blanco/gris, bordes grises)

```tsx
<div className="rounded-lg border border-border bg-card text-card-foreground shadow-sm">
  <div className="flex flex-col space-y-1.5 p-6">
    <h3 className="text-2xl font-semibold leading-none tracking-tight text-foreground">Título</h3>
    <p className="text-sm text-muted-foreground">Descripción</p>
  </div>
  <div className="p-6 pt-0">Contenido</div>
</div>
```

### Input con tokens HSBC

```tsx
<input
  className={cn(
    'flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm',
    'ring-offset-background placeholder:text-muted-foreground',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
    error && 'border-destructive focus-visible:ring-destructive'
  )}
  aria-invalid={!!error}
/>
```

## Utilidades

```typescript
// lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const focusRing = cn(
  "focus-visible:outline-none focus-visible:ring-2",
  "focus-visible:ring-ring focus-visible:ring-offset-2"
);
```

## Checklist v3 → v4

- [ ] Sustituir `tailwind.config.ts` por bloque `@theme` en CSS
- [ ] Usar `@import "tailwindcss"` en lugar de directivas `@tailwind`
- [ ] Definir colores en `@theme { --color-* }` (primario = rojo HSBC, grises, negro, blanco)
- [ ] Modales: backdrop `bg-gray-900/50 backdrop-blur-sm`, panel blanco, footer gris, botón principal `bg-primary`
- [ ] Usar tokens semánticos en lugar de hex directo en componentes
- [ ] Considerar `size-*` para cuadrados (ej. `size-10`)

## Buenas prácticas

**Sí**

- Usar bloque `@theme` para toda la configuración visual.
- Priorizar **rojo, negro, gris y blanco** en paleta.
- Componentes modales con mismo patrón: backdrop + panel + header/footer con gris y primary.
- Componer variantes con CVA y `cn()`.
- Estados de foco y accesibilidad (ARIA, `role="dialog"`, `aria-modal`).

**No**

- No usar `tailwind.config.ts` para temas; usar `@theme` en CSS.
- No hardcodear colores que no sean de marca; extender `@theme` si hace falta.
- No hacer modales con fondos o bordes que rompan la coherencia con el resto de la app (mantener gris/blanco + primary para acciones).
- No olvidar contraste (negro/gris oscuro sobre blanco; blanco sobre primary).
