import { useState, useEffect } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { usePermissions } from '../../hooks/usePermissions';
import { FaHome, FaBars, FaUser, FaSignOutAlt, FaCog } from 'react-icons/fa';
import { cn } from '../../lib/utils';

export default function Layout() {
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { hasPermission } = usePermissions();

  useEffect(() => {
    const handleResize = () => setSidebarOpen(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const linkClass = ({ isActive }) =>
    cn(
      'flex items-center gap-3 p-2 rounded-md text-foreground transition-colors',
      isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-accent hover:text-accent-foreground'
    );

  return (
    <div className="relative min-h-screen md:flex">
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-gray-900/50 z-10"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}

      <aside
        className={cn(
          'bg-card text-card-foreground w-64 py-7 px-2 absolute inset-y-0 left-0 z-20 flex flex-col transition-transform duration-200 ease-in-out border-r border-border',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
          'md:relative md:translate-x-0'
        )}
      >
        <div className="h-16 flex items-center justify-center gap-2 -mx-2 -mt-7 px-2">
          <img
            src="/logo.png"
            alt=""
            className="h-8 w-auto object-contain"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <h1 className="text-xl font-semibold text-foreground">KYC OPS</h1>
        </div>

        <nav className="flex-grow mt-4" onClick={() => window.innerWidth < 768 && setSidebarOpen(false)}>
          <NavLink to="/" className={linkClass}>
            <FaHome /> <span>Inicio</span>
          </NavLink>
          {hasPermission('/usuarios') && (
            <NavLink to="/usuarios" className={linkClass}>
              <FaUser /> <span>Usuarios</span>
            </NavLink>
          )}
          {hasPermission('/roles-permisos') && (
            <NavLink to="/roles-permisos" className={linkClass}>
              <FaCog /> <span>Roles y permisos</span>
            </NavLink>
          )}
        </nav>
      </aside>

      <main className="flex-1 flex flex-col min-h-screen bg-background">
        <header className="bg-card border-b border-border px-4 py-3 flex items-center justify-between">
          <button
            type="button"
            className="md:hidden p-2 rounded-md hover:bg-accent"
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menú"
          >
            <FaBars className="text-xl" />
          </button>
          <div className="flex-1" />
          <div className="relative">
            <button
              type="button"
              className="flex items-center gap-2 p-2 rounded-md hover:bg-accent"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            >
              <FaUser />
              <span className="hidden sm:inline text-foreground">{user?.nombre ?? 'Usuario'}</span>
            </button>
            {isUserMenuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsUserMenuOpen(false)} aria-hidden />
                <div className="absolute right-0 mt-1 w-48 bg-card rounded-lg shadow-xl border border-border py-1 z-20">
                  <div className="px-4 py-2 border-b border-border text-sm text-muted-foreground">
                    {user?.rol?.nombre}
                  </div>
                  <button
                    type="button"
                    className="w-full text-left px-4 py-2 text-sm text-primary hover:bg-accent flex items-center gap-2"
                    onClick={() => { logout(); setIsUserMenuOpen(false); }}
                  >
                    <FaSignOutAlt /> <span>Cerrar sesión</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </header>

        <div className="flex-1 p-4 bg-secondary overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
