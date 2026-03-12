import toast from 'react-hot-toast';

export const handleApiError = async (response, defaultMessage = 'Error en la solicitud') => {
  try {
    const errorData = await response.json();
    const errorMessage = errorData.message || errorData.error || defaultMessage;
    const error = new Error(errorMessage);
    error.status = response.status;
    error.statusCode = response.status;
    error.data = errorData;
    return error;
  } catch {
    const error = new Error(defaultMessage || response.statusText);
    error.status = response.status;
    error.statusCode = response.status;
    return error;
  }
};

export const handleApiErrorWithNotification = async (response, defaultMessage = 'Error en la solicitud') => {
  const error = await handleApiError(response, defaultMessage);
  toast.error(error.message, { duration: 5000, position: 'top-right' });
  return error;
};
