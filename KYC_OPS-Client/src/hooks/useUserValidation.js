import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext.js';

export const useUserValidation = () => {
  const { validateUser, refreshPermissions, user, isAuthenticated } = useContext(AuthContext);

  const validateOnPageChange = async () => {
    if (!isAuthenticated) return false;
    return await validateUser();
  };

  return {
    validateUser,
    validateOnPageChange,
    isAuthenticated,
    user
  };
};
