import API_URL from '../apiConfig';
import { getCurrentConfig, isDevelopment } from '../config/environment';
import { handleApiErrorWithNotification } from './errorHandler';

export const loadSSOUser = () => {
  return new Promise((resolve, reject) => {
    const cachedUser = sessionStorage.getItem('ssoUser');
    if (cachedUser) {
      try {
        resolve(JSON.parse(cachedUser));
        return;
      } catch { }
    }

    const config = getCurrentConfig();

    if (isDevelopment()) {
      const ssoId = config.defaultUserId;
      getUserBySSO(ssoId)
        .then(user => {
          if (user) {
            sessionStorage.setItem('ssoUser', JSON.stringify(user));
            resolve(user);
          } else {
            reject(new Error('Usuario no encontrado en la base de datos'));
          }
        })
        .catch(reject);
    } else {
      const script = document.createElement('script');
      script.src = config.ssoScriptUrl;
      script.onload = () => {
        setTimeout(() => {
          try {
            const ssoId = window.staffDetails_empid;
            if (!ssoId) {
              reject(new Error('No se pudo obtener el SSO ID del usuario'));
              return;
            }
            getUserBySSO(ssoId)
              .then(user => {
                if (user) {
                  sessionStorage.setItem('ssoUser', JSON.stringify(user));
                  resolve(user);
                } else {
                  reject(new Error('Usuario no encontrado en la base de datos'));
                }
              })
              .catch(reject);
          } catch {
            reject(new Error('Error al procesar los datos SSO'));
          }
        }, 1000);
      };
      script.onerror = () => reject(new Error('Error al cargar el script SSO'));
      document.head.appendChild(script);
    }
  });
};

export const getUserBySSO = async (ssoId) => {
  const response = await fetch(`${API_URL}/usuario/registro/${ssoId}`);
  if (!response.ok) {
    if (response.status === 404) return null;
    throw await handleApiErrorWithNotification(response, 'Error al obtener los datos del usuario');
  }
  return response.json();
};

export const clearUserSession = () => sessionStorage.removeItem('ssoUser');

export const getCurrentUser = () => {
  const cached = sessionStorage.getItem('ssoUser');
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch { }
  }
  return null;
};

export const validateUserStatus = async (registro) => {
  try {
    const response = await fetch(`${API_URL}/usuario/validate/${registro}`);
    if (!response.ok) {
      const error = await handleApiErrorWithNotification(response, 'Error al validar usuario');
      return { isValid: false, error: error.message };
    }
    return response.json();
  } catch (error) {
    return { isValid: false, error: error.message };
  }
};

export const refreshUserPermissions = async (registro) => {
  try {
    const response = await fetch(`${API_URL}/usuario/refresh-permissions/${registro}`, { method: 'POST' });
    if (!response.ok) {
      const error = await handleApiErrorWithNotification(response, 'Error al actualizar permisos');
      return { success: false, error: error.message };
    }
    return response.json();
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const validateCurrentUser = async () => {
  const currentUser = getCurrentUser();
  if (!currentUser) return { isValid: false, user: null };

  try {
    const validation = await validateUserStatus(currentUser.registro);
    if (!validation.isValid) {
      clearUserSession();
      return { isValid: false, user: null };
    }

    const serverUser = validation.usuario;
    const currentPermisos = currentUser.permisos || [];
    const serverPermisos = serverUser?.permisos || [];
    const permisosCambiaron =
      currentPermisos.length !== serverPermisos.length ||
      !currentPermisos.every(p => serverPermisos.includes(p)) ||
      !serverPermisos.every(p => currentPermisos.includes(p));
    const rolCambio = currentUser.rol?.nombre !== serverUser?.rol;

    if (permisosCambiaron || rolCambio) {
      const updatedUser = {
        ...currentUser,
        rol: { ...currentUser.rol, nombre: serverUser?.rol },
        permisos: serverPermisos
      };
      sessionStorage.setItem('ssoUser', JSON.stringify(updatedUser));
      return { isValid: true, user: updatedUser, updated: true, changes: { permisosCambiaron, rolCambio } };
    }
    return { isValid: true, user: currentUser, updated: false };
  } catch {
    return { isValid: true, user: currentUser };
  }
};
