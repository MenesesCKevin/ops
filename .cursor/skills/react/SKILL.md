---
name: react
description: React component development guide. Use when working with React components (.tsx/.jsx), creating UI, implementing routing, or building frontend features. Triggers on React component creation, modification, layout implementation, or navigation tasks. In this project use Vite + React Router DOM + Tailwind (no Next.js, no @lobehub/ui).
---

# React Component Writing Guide

- For styles use Tailwind CSS with design tokens (see tailwind-hsbc-design-system skill); for simple cases use inline `style` attribute
- Use Flexbox (Tailwind: `flex`, `flex-col`, `gap`, `items-center`, `justify-between`) for layouts
- Component priority: `src/components/ui` (design system) > `src/components` > installed packages
- Use React Router DOM for navigation: `Link`, `useNavigate`, `Outlet`; do not use `next/link`

## Project Structure (KYC_OPS)

| Path | Purpose |
|------|---------|
| `src/components/ui/` | Primitives: Button, Card, Input, LoadingSpinner, Modal |
| `src/components/layout/` | Layout, Sidebar, Header |
| `src/components/auth/` | ProtectedRoute, PermissionRoute |
| `src/pages/` | Route-level page components |
| `src/features/` | Optional: feature-specific modules |
| `src/hooks/` | useAuth, usePermissions, useUserValidation |
| `src/contexts/` | AuthContext |
| `src/services/` | authService, errorHandler |
| `src/lib/` | utils (cn, focusRing) |
| `src/router/` | Route config and router setup |

## Routing Architecture

Single SPA with React Router DOM. All routes defined in router config; lazy-loaded pages.

### Key Files

- Entry: `src/main.jsx`
- Router config: `src/router/routes.jsx` – route definitions and lazy elements
- App: `src/App.jsx` – wraps with providers and renders router

### Navigation

Use `Link` and `useNavigate` from `react-router-dom`, never `next/link`.

```jsx
// ✅ Correct
import { Link, useNavigate } from 'react-router-dom';

<Link to="/">Home</Link>;
<Link to="/usuarios">Usuarios</Link>;

const navigate = useNavigate();
navigate('/usuarios');
```

## Layout with Tailwind (Flexbox)

Use Tailwind flex utilities instead of @lobehub/ui Flexbox:

```jsx
// Vertical stack
<div className="flex flex-col gap-4">
  <Header />
  <main className="flex-1 overflow-auto">{children}</main>
</div>

// Horizontal layout (sidebar + content)
<div className="flex h-full w-full">
  <aside className="w-64 shrink-0 border-r border-border">Sidebar</aside>
  <div className="flex-1 min-w-0 flex flex-col">
    <div className="flex-1 p-4 overflow-auto">{content}</div>
  </div>
</div>

// Center content
<div className="flex items-center justify-center min-h-screen">
  <Content />
</div>
```

## Best Practices

- Keep pages thin; put reusable logic in hooks and components
- Use `cn()` from `src/lib/utils` for conditional Tailwind classes
- Prefer design system tokens (bg-primary, text-foreground, border-border) over raw colors
- Lazy-load page components in route config
- Use semantic HTML and ARIA where relevant (modals: role="dialog", aria-modal)
