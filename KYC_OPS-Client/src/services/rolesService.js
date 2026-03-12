import API_URL from '../apiConfig';
import { handleApiErrorWithNotification } from './errorHandler';

const BASE = `${API_URL}/rol`;

export async function getRoles() {
  const res = await fetch(BASE);
  if (!res.ok) throw await handleApiErrorWithNotification(res, 'Error al cargar roles');
  return res.json();
}

export async function getRolById(id) {
  const res = await fetch(`${BASE}/${id}`);
  if (!res.ok) throw await handleApiErrorWithNotification(res, 'Error al cargar rol');
  return res.json();
}

export async function createRol(data) {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await handleApiErrorWithNotification(res, 'Error al crear rol');
  return res.json();
}

export async function updateRol(id, data) {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await handleApiErrorWithNotification(res, 'Error al actualizar rol');
  return res.json();
}

export async function setRolPermisos(rolId, permisoIds) {
  const res = await fetch(`${BASE}/${rolId}/permisos`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(permisoIds ?? []),
  });
  if (!res.ok) throw await handleApiErrorWithNotification(res, 'Error al asignar permisos');
}
