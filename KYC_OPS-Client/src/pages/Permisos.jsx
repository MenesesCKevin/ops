import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { FaPlus, FaEdit } from 'react-icons/fa';
import * as permisosApi from '../services/permisosService';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Modal from '../components/ui/Modal';

const emptyForm = { nombre: '', descripcion: '', ruta: '' };

export default function Permisos() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await permisosApi.getPermisos();
      setList(data);
    } catch {
      setList([]);
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

  const openEdit = (p) => {
    setEditingId(p.id);
    setForm({
      nombre: p.nombre,
      descripcion: p.descripcion ?? '',
      ruta: p.ruta,
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
        descripcion: form.descripcion.trim(),
        ruta: form.ruta.trim(),
      };
      if (editingId) {
        await permisosApi.updatePermiso(editingId, payload);
        toast.success('Permiso actualizado');
      } else {
        await permisosApi.createPermiso(payload);
        toast.success('Permiso creado');
      }
      closeModal();
      load();
    } catch {
    } finally {
      setSaving(false);
    }
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
        form="permiso-form"
        disabled={saving}
        className="px-4 py-2 rounded-md font-medium text-primary-foreground bg-primary hover:bg-primary-hover disabled:opacity-50"
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
            Permisos
          </h2>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md font-medium text-primary-foreground bg-primary hover:bg-primary-hover"
          >
            <FaPlus /> Nuevo permiso
          </button>
        </div>
        <p className="text-sm text-muted-foreground">Rutas y permisos del sistema</p>
      </div>

      <div className="p-6">
        {loading ? (
          <LoadingSpinner message="Cargando permisos..." />
        ) : list.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center">No hay permisos registrados.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-2 pr-4 font-semibold text-foreground">Ruta</th>
                  <th className="pb-2 pr-4 font-semibold text-foreground">Nombre</th>
                  <th className="pb-2 pr-4 font-semibold text-foreground">Descripción</th>
                  <th className="pb-2 font-semibold text-foreground">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {list.map((p) => (
                  <tr key={p.id} className="border-b border-border">
                    <td className="py-3 pr-4 font-mono">{p.ruta}</td>
                    <td className="py-3 pr-4">{p.nombre}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{p.descripcion || '—'}</td>
                    <td className="py-3">
                      <button
                        type="button"
                        onClick={() => openEdit(p)}
                        className="p-2 rounded hover:bg-accent"
                        title="Editar"
                      >
                        <FaEdit />
                      </button>
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
        title={editingId ? 'Editar permiso' : 'Nuevo permiso'}
        footer={footer}
        panelClassName="max-w-lg"
      >
        <form id="permiso-form" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Ruta</label>
            <input
              type="text"
              className="input-style font-mono"
              placeholder="/ejemplo"
              value={form.ruta}
              onChange={(e) => setForm((f) => ({ ...f, ruta: e.target.value }))}
              required
              maxLength={200}
            />
          </div>
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
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Descripción</label>
            <textarea
              className="input-style min-h-[80px]"
              value={form.descripcion}
              onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))}
              maxLength={500}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
