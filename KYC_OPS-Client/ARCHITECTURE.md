# KYC OPS – Arquitectura del frontend

React 19 + Vite 7 + Tailwind CSS v4. Design system HSBC y buenas prácticas (skills en `.cursor/skills/`).

## Estructura de carpetas

```
src/
├── components/
│   ├── ui/           # Primitivos del design system (LoadingSpinner, Modal, etc.)
│   ├── layout/       # Layout, sidebar, header
│   └── auth/         # ProtectedRoute, PermissionRoute
├── pages/            # Páginas por ruta (Home, Users, RolePermissionsPage)
├── router/           # Configuración de rutas (routes.jsx → AppRoutes)
├── hooks/            # useAuth, usePermissions, useUserValidation
├── contexts/         # AuthContext (AuthProvider)
├── services/         # authService, errorHandler
├── config/           # environment
├── lib/              # utils (cn, focusRing)
├── App.jsx
└── main.jsx
```

## Rutas

- Definidas en `src/router/routes.jsx`. `App.jsx` solo envuelve con `AuthProvider` y renderiza `<AppRoutes />`.
- Navegación: `Link` y `useNavigate` de `react-router-dom` (no usar `next/link`).

## Estilos

- Tema HSBC en `src/index.css`: bloque `@theme` con tokens (primary, background, border, etc.).
- Componentes: usar clases con tokens (`bg-primary`, `text-foreground`, `border-border`) y `cn()` de `src/lib/utils` para clases condicionales.

## Skills del agente

- **tailwind-hsbc-design-system**: tokens, modales, CVA, accesibilidad.
- **react**: estructura de componentes, rutas, layouts con Tailwind, buenas prácticas.
