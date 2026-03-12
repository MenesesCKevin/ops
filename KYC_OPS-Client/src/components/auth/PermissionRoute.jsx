import { useEffect, useState } from 'react';
import { usePermissions } from '../../hooks/usePermissions';
import { useUserValidation } from '../../hooks/useUserValidation';
import LoadingSpinner from '../ui/LoadingSpinner';

const PermissionRoute = ({ children, requiredPermission }) => {
  const { hasPermission, userPermissions } = usePermissions();
  const { validateOnPageChange, isAuthenticated } = useUserValidation();
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    const run = async () => {
      if (isAuthenticated) await validateOnPageChange();
      setIsValidating(false);
    };
    run();
  }, [isAuthenticated, validateOnPageChange]);

  if (isValidating || userPermissions.length === 0) {
    return <LoadingSpinner message="Verificando permisos..." />;
  }

  if (!hasPermission(requiredPermission)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-secondary">
        <div className="text-center">
          <div className="text-destructive text-xl mb-4">Acceso denegado</div>
          <p className="text-muted-foreground">No tienes permisos para acceder a esta página</p>
        </div>
      </div>
    );
  }

  return children;
};

export default PermissionRoute;
