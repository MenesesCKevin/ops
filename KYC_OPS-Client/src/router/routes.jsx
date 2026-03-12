import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import PermissionRoute from '../components/auth/PermissionRoute';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Home = lazy(() => import('../pages/Home'));
const Users = lazy(() => import('../pages/Users'));
const RolePermissionsPage = lazy(() => import('../pages/RolePermissionsPage'));

/** Rutas de la aplicación. Layout y rutas protegidas aplicados aquí. */
export function AppRoutes() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route
            path="usuarios"
            element={
              <PermissionRoute requiredPermission="/usuarios">
                <Users />
              </PermissionRoute>
            }
          />
          <Route
            path="roles-permisos"
            element={
              <PermissionRoute requiredPermission="/roles-permisos">
                <RolePermissionsPage />
              </PermissionRoute>
            }
          />
        </Route>
      </Routes>
    </Suspense>
  );
}
