import API_URL from '../apiConfig';
import { handleApiErrorWithNotification } from './errorHandler';

const BASE = `${API_URL}/permiso`;

export async function getPermisos() {
  const res = await fetch(BASE);
  if (!res.ok) throw await handleApiErrorWithNotification(res, 'Error al cargar permisos');
  return res.json();
}

export async function getPermisoById(id) {
  const res = await fetch(`${BASE}/${id}`);
  if (!res.ok) throw await handleApiErrorWithNotification(res, 'Error al cargar permiso');
  return res.json();
}

export async function createPermiso(data) {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await handleApiErrorWithNotification(res, 'Error al crear permiso');
  return res.json();
}

export async function updatePermiso(id, data) {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await handleApiErrorWithNotification(res, 'Error al actualizar permiso');
  return res.json();
}
