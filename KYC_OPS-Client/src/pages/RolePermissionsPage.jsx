import { useState } from 'react';
import { FaUserShield, FaKey } from 'react-icons/fa';
import Roles from './Roles';
import Permisos from './Permisos';
import { cn } from '../lib/utils';

const TABS = [
  { id: 'roles', label: 'Roles', icon: FaUserShield },
  { id: 'permisos', label: 'Permisos', icon: FaKey },
];

export default function RolePermissionsPage() {
  const [tab, setTab] = useState('roles');

  return (
    <div className="space-y-4">
      <div className="flex gap-2 border-b border-border pb-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2 rounded-t-md font-medium transition-colors',
              tab === t.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-foreground hover:bg-accent'
            )}
          >
            <t.icon /> {t.label}
          </button>
        ))}
      </div>
      {tab === 'roles' && <Roles />}
      {tab === 'permisos' && <Permisos />}
    </div>
  );
}
