import API_URL from '../apiConfig';
import { handleApiErrorWithNotification } from './errorHandler';

const BASE = `${API_URL}/usuario`;

export async function getUsuarios() {
  const res = await fetch(BASE);
  if (!res.ok) throw await handleApiErrorWithNotification(res, 'Error al cargar usuarios');
  return res.json();
}

export async function getUsuarioById(id) {
  const res = await fetch(`${BASE}/${id}`);
  if (!res.ok) throw await handleApiErrorWithNotification(res, 'Error al cargar usuario');
  return res.json();
}

export async function createUsuario(data) {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await handleApiErrorWithNotification(res, 'Error al crear usuario');
  return res.json();
}

export async function updateUsuario(id, data) {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await handleApiErrorWithNotification(res, 'Error al actualizar usuario');
  return res.json();
}

export async function activateUsuario(id) {
  const res = await fetch(`${BASE}/${id}/activate`, { method: 'PATCH' });
  if (!res.ok) throw await handleApiErrorWithNotification(res, 'Error al activar usuario');
}

export async function deactivateUsuario(id) {
  const res = await fetch(`${BASE}/${id}/deactivate`, { method: 'PATCH' });
  if (!res.ok) throw await handleApiErrorWithNotification(res, 'Error al desactivar usuario');
}
