import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { FaPlus, FaEdit, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import * as usuariosApi from '../services/usuariosService';
import * as rolesApi from '../services/rolesService';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Modal from '../components/ui/Modal';
import { cn } from '../lib/utils';

const emptyForm = {
  nombre: '',
  iniciales: '',
  registro: '',
  correo: '',
  responsableId: 0,
  extension: '',
  rolId: '',
};

export default function Users() {
  const [list, setList] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [usuarios, rolesList] = await Promise.all([
        usuariosApi.getUsuarios(),
        rolesApi.getRoles(),
      ]);
      setList(usuarios);
      setRoles(rolesList);
    } catch {
      setList([]);
      setRoles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (u) => {
    setEditingId(u.id);
    setForm({
      nombre: u.nombre,
      iniciales: u.iniciales,
      registro: String(u.registro),
      correo: u.correo,
      responsableId: u.responsableId ?? 0,
      extension: u.extension != null ? String(u.extension) : '',
      rolId: String(u.rolId),
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        nombre: form.nombre.trim(),
        iniciales: form.iniciales.trim(),
        registro: parseInt(form.registro, 10) || 0,
        correo: form.correo.trim(),
        responsableId: parseInt(form.responsableId, 10) || 0,
        extension: form.extension ? parseInt(form.extension, 10) : null,
        rolId: parseInt(form.rolId, 10) || roles[0]?.id,
      };
      if (editingId) {
        await usuariosApi.updateUsuario(editingId, payload);
        toast.success('Usuario actualizado');
      } else {
        await usuariosApi.createUsuario(payload);
        toast.success('Usuario creado');
      }
      closeModal();
      load();
    } catch {
      // error already shown by service
    } finally {
      setSaving(false);
    }
  };

  const handleActivate = async (id) => {
    try {
      await usuariosApi.activateUsuario(id);
      toast.success('Usuario activado');
      load();
    } catch {}
  };

  const handleDeactivate = async (id) => {
    try {
      await usuariosApi.deactivateUsuario(id);
      toast.success('Usuario desactivado');
      load();
    } catch {}
  };

  const footer = (
    <>
      <button
        type="button"
        onClick={closeModal}
        className="px-4 py-2 rounded-md font-medium text-foreground bg-secondary hover:bg-secondary/80 transition-colors"
      >
        Cancelar
      </button>
      <button
        type="submit"
        form="usuario-form"
        disabled={saving}
        className="px-4 py-2 rounded-md font-medium text-primary-foreground bg-primary hover:bg-primary-hover transition-colors disabled:opacity-50"
      >
        {saving ? 'Guardando...' : editingId ? 'Actualizar' : 'Crear'}
      </button>
    </>
  );

  return (
    <div className="rounded-lg border border-border bg-card text-card-foreground shadow-sm">
      <div className="flex flex-col gap-1.5 p-6 border-b border-border">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold leading-none tracking-tight text-foreground">
            Usuarios
          </h2>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md font-medium text-primary-foreground bg-primary hover:bg-primary-hover transition-colors"
          >
            <FaPlus /> Nuevo usuario
          </button>
        </div>
        <p className="text-sm text-muted-foreground">Gestión de usuarios del sistema</p>
      </div>

      <div className="p-6">
        {loading ? (
          <LoadingSpinner message="Cargando usuarios..." />
        ) : list.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center">No hay usuarios registrados.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-2 pr-4 font-semibold text-foreground">Nombre</th>
                  <th className="pb-2 pr-4 font-semibold text-foreground">Registro</th>
                  <th className="pb-2 pr-4 font-semibold text-foreground">Correo</th>
                  <th className="pb-2 pr-4 font-semibold text-foreground">Rol</th>
                  <th className="pb-2 pr-4 font-semibold text-foreground">Estado</th>
                  <th className="pb-2 font-semibold text-foreground">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {list.map((u) => (
                  <tr key={u.id} className="border-b border-border">
                    <td className="py-3 pr-4">{u.nombre}</td>
                    <td className="py-3 pr-4">{u.registro}</td>
                    <td className="py-3 pr-4">{u.correo}</td>
                    <td className="py-3 pr-4">{u.rolNombre}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium',
                          u.activo ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'
                        )}
                      >
                        {u.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="py-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(u)}
                        className="p-2 rounded hover:bg-accent text-foreground"
                        title="Editar"
                      >
                        <FaEdit />
                      </button>
                      {u.activo ? (
                        <button
                          type="button"
                          onClick={() => handleDeactivate(u.id)}
                          className="p-2 rounded hover:bg-red-50 text-destructive"
                          title="Desactivar"
                        >
                          <FaTimesCircle />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleActivate(u.id)}
                          className="p-2 rounded hover:bg-green-50 text-green-600"
                          title="Activar"
                        >
                          <FaCheckCircle />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editingId ? 'Editar usuario' : 'Nuevo usuario'}
        footer={footer}
        panelClassName="max-w-lg"
      >
        <form id="usuario-form" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Nombre</label>
            <input
              type="text"
              className="input-style"
              value={form.nombre}
              onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
              required
              maxLength={100}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Iniciales</label>
              <input
                type="text"
                className="input-style"
                value={form.iniciales}
                onChange={(e) => setForm((f) => ({ ...f, iniciales: e.target.value }))}
                required
                maxLength={5}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Registro</label>
              <input
                type="number"
                className="input-style"
                value={form.registro}
                onChange={(e) => setForm((f) => ({ ...f, registro: e.target.value }))}
                required
                disabled={!!editingId}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Correo</label>
            <input
              type="email"
              className="input-style"
              value={form.correo}
              onChange={(e) => setForm((f) => ({ ...f, correo: e.target.value }))}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Responsable ID</label>
              <input
                type="number"
                className="input-style"
                value={form.responsableId}
                onChange={(e) => setForm((f) => ({ ...f, responsableId: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Extensión</label>
              <input
                type="number"
                className="input-style"
                value={form.extension}
                onChange={(e) => setForm((f) => ({ ...f, extension: e.target.value }))}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Rol</label>
            <select
              className="input-style"
              value={form.rolId}
              onChange={(e) => setForm((f) => ({ ...f, rolId: e.target.value }))}
              required
            >
              <option value="">Seleccionar rol</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.nombre}
                </option>
              ))}
            </select>
          </div>
        </form>
      </Modal>
    </div>
  );
}
