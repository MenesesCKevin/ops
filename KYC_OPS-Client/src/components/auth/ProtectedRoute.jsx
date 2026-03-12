import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../ui/LoadingSpinner';
import { cn } from '../../lib/utils';

const ProtectedRoute = ({ children }) => {
  const { user, loading, error } = useAuth();

  if (loading) return <LoadingSpinner message="Autenticando usuario..." />;

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-secondary">
        <div className="text-center">
          <div className="text-destructive text-xl mb-4">Error de autenticación</div>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className={cn(
              'px-4 py-2 rounded-md font-medium text-primary-foreground bg-primary hover:bg-primary-hover transition-colors'
            )}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-secondary">
        <div className="text-center">
          <div className="text-destructive text-xl mb-4">Acceso denegado</div>
          <p className="text-muted-foreground">No se pudo autenticar al usuario</p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
