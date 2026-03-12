import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  loadSSOUser,
  getCurrentUser,
  clearUserSession,
  validateCurrentUser,
  refreshUserPermissions
} from '../services/authService';
import { AuthContext } from './AuthContext.js';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const validationIntervalRef = useRef(null);

  const logout = useCallback(() => {
    if (validationIntervalRef.current) {
      clearInterval(validationIntervalRef.current);
      validationIntervalRef.current = null;
    }
    clearUserSession();
    setUser(null);
    setError(null);
  }, []);

  const validateUser = useCallback(async () => {
    try {
      const validation = await validateCurrentUser();
      if (!validation.isValid) {
        logout();
        setError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        return false;
      }
      if (validation.updated) setUser(validation.user);
      return true;
    } catch {
      return true;
    }
  }, [logout]);

  const startUserValidation = useCallback(() => {
    if (validationIntervalRef.current) clearInterval(validationIntervalRef.current);
    validationIntervalRef.current = setInterval(validateUser, 900000);
  }, [validateUser]);

  const loadUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const cachedUser = getCurrentUser();
      if (cachedUser) {
        const validation = await validateCurrentUser();
        if (validation.isValid) {
          setUser(validation.updated ? validation.user : cachedUser);
          startUserValidation();
        } else {
          setUser(null);
          setError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        }
        setLoading(false);
        return;
      }
      const userData = await loadSSOUser();
      setUser(userData);
      startUserValidation();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [startUserValidation]);

  const refreshPermissions = useCallback(async () => {
    const currentUser = getCurrentUser();
    if (!currentUser) return false;
    try {
      const result = await refreshUserPermissions(currentUser.registro);
      if (result.success && result.usuario) {
        const updatedUser = {
          ...currentUser,
          rol: { ...currentUser.rol, nombre: result.usuario.rol },
          permisos: result.usuario.permisos || []
        };
        sessionStorage.setItem('ssoUser', JSON.stringify(updatedUser));
        setUser(updatedUser);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    loadUser();
    return () => {
      if (validationIntervalRef.current) {
        clearInterval(validationIntervalRef.current);
      }
    };
  }, [loadUser]);

  const hasPermission = (permission) => {
    if (!user || !user.permisos) return false;
    return user.permisos.includes(permission);
  };

  const value = {
    user,
    loading,
    error,
    logout,
    reloadUser: loadUser,
    validateUser,
    refreshPermissions,
    isAuthenticated: !!user,
    hasPermission
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
