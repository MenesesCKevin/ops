import { useAuth } from './useAuth';

export const usePermissions = () => {
  const { user } = useAuth();

  const hasPermission = (permission) => {
    if (!user || !user.permisos) return false;
    return user.permisos.includes(permission);
  };

  return {
    hasPermission,
    userPermissions: user?.permisos || []
  };
};
