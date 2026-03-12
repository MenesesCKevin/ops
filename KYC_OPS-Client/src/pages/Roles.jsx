import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { FaPlus, FaEdit, FaKey } from 'react-icons/fa';
import * as rolesApi from '../services/rolesService';
import * as permisosApi from '../services/permisosService';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Modal from '../components/ui/Modal';
import { cn } from '../lib/utils';

export default function Roles() {
  const [list, setList] = useState([]);
  const [permisos, setPermisos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [permisosModalOpen, setPermisosModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingRol, setEditingRol] = useState(null);
  const [formNombre, setFormNombre] = useState('');
  const [selectedPermisoIds, setSelectedPermisoIds] = useState([]);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [rolesList, permisosList] = await Promise.all([
        rolesApi.getRoles(),
        permisosApi.getPermisos(),
      ]);
      setList(rolesList);
      setPermisos(permisosList);
    } catch {
      setList([]);
      setPermisos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditingId(null);
    setFormNombre('');
    setModalOpen(true);
  };

  const openEdit = (r) => {
    setEditingId(r.id);
    setFormNombre(r.nombre);
    setModalOpen(true);
  };

  const openPermisos = async (r) => {
    setEditingRol(r);
    try {
      const full = await rolesApi.getRolById(r.id);
      setSelectedPermisoIds(full.permisoIds ?? []);
      setPermisosModalOpen(true);
    } catch {
      toast.error('No se pudo cargar el rol');
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setFormNombre('');
  };

  const closePermisosModal = () => {
    setPermisosModalOpen(false);
    setEditingRol(null);
    setSelectedPermisoIds([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formNombre.trim()) return;
    setSaving(true);
    try {
      if (editingId) {
        const full = await rolesApi.getRolById(editingId);
        await rolesApi.updateRol(editingId, {
          nombre: formNombre.trim(),
          permisoIds: full.permisoIds ?? [],
        });
        toast.success('Rol actualizado');
      } else {
        await rolesApi.createRol({ nombre: formNombre.trim(), permisoIds: [] });
        toast.success('Rol creado');
      }
      closeModal();
      load();
    } catch {
    } finally {
      setSaving(false);
    }
  };

  const handleSavePermisos = async () => {
    if (!editingRol) return;
    setSaving(true);
    try {
      await rolesApi.setRolPermisos(editingRol.id, selectedPermisoIds);
      toast.success('Permisos actualizados');
      closePermisosModal();
      load();
    } catch {
    } finally {
      setSaving(false);
    }
  };

  const togglePermiso = (id) => {
    setSelectedPermisoIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const footer = (
    <>
      <button
        type="button"
        onClick={closeModal}
        className="px-4 py-2 rounded-md font-medium text-foreground bg-secondary hover:bg-secondary/80"
      >
        Cancelar
      </button>
      <button
        type="submit"
        form="rol-form"
        disabled={saving}
        className="px-4 py-2 rounded-md font-medium text-primary-foreground bg-primary hover:bg-primary-hover disabled:opacity-50"
      >
        {saving ? 'Guardando...' : editingId ? 'Actualizar' : 'Crear'}
      </button>
    </>
  );

  const permisosFooter = (
    <>
      <button
        type="button"
        onClick={closePermisosModal}
        className="px-4 py-2 rounded-md font-medium text-foreground bg-secondary hover:bg-secondary/80"
      >
        Cerrar
      </button>
      <button
        type="button"
        onClick={handleSavePermisos}
        disabled={saving}
        className="px-4 py-2 rounded-md font-medium text-primary-foreground bg-primary hover:bg-primary-hover disabled:opacity-50"
      >
        {saving ? 'Guardando...' : 'Guardar permisos'}
      </button>
    </>
  );

  return (
    <div className="rounded-lg border border-border bg-card text-card-foreground shadow-sm">
      <div className="flex flex-col gap-1.5 p-6 border-b border-border">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold leading-none tracking-tight text-foreground">
            Roles
          </h2>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md font-medium text-primary-foreground bg-primary hover:bg-primary-hover"
          >
            <FaPlus /> Nuevo rol
          </button>
        </div>
        <p className="text-sm text-muted-foreground">Gestión de roles y asignación de permisos</p>
      </div>

      <div className="p-6">
        {loading ? (
          <LoadingSpinner message="Cargando roles..." />
        ) : list.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center">No hay roles registrados.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-2 pr-4 font-semibold text-foreground">Nombre</th>
                  <th className="pb-2 pr-4 font-semibold text-foreground">Permisos</th>
                  <th className="pb-2 font-semibold text-foreground">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {list.map((r) => (
                  <tr key={r.id} className="border-b border-border">
                    <td className="py-3 pr-4">{r.nombre}</td>
                    <td className="py-3 pr-4">{r.permisosCount}</td>
                    <td className="py-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(r)}
                        className="p-2 rounded hover:bg-accent"
                        title="Editar"
                      >
                        <FaEdit />
                      </button>
                      <button
                        type="button"
                        onClick={() => openPermisos(r)}
                        className="p-2 rounded hover:bg-accent"
                        title="Asignar permisos"
                      >
                        <FaKey />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={closeModal} title={editingId ? 'Editar rol' : 'Nuevo rol'} footer={footer}>
        <form id="rol-form" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Nombre</label>
            <input
              type="text"
              className="input-style"
              value={formNombre}
              onChange={(e) => setFormNombre(e.target.value)}
              required
              maxLength={100}
            />
          </div>
        </form>
      </Modal>

      <Modal
        open={permisosModalOpen}
        onClose={closePermisosModal}
        title={editingRol ? `Permisos: ${editingRol.nombre}` : 'Permisos'}
        footer={permisosFooter}
        panelClassName="max-w-lg"
      >
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {permisos.map((p) => (
            <label
              key={p.id}
              className={cn(
                'flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-accent',
                selectedPermisoIds.includes(p.id) && 'bg-primary/10'
              )}
            >
              <input
                type="checkbox"
                checked={selectedPermisoIds.includes(p.id)}
                onChange={() => togglePermiso(p.id)}
                className="rounded border-border"
              />
              <span className="font-mono text-sm">{p.ruta}</span>
              <span className="text-muted-foreground text-xs">{p.nombre}</span>
            </label>
          ))}
          {permisos.length === 0 && (
            <p className="text-muted-foreground text-sm">No hay permisos. Crea algunos en la pestaña Permisos.</p>
          )}
        </div>
      </Modal>
    </div>
  );
}
