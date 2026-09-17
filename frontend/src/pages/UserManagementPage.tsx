import React, { useEffect, useState } from 'react';
import axios from 'axios';
import type { User } from '../types/user';
import { userService } from '../services/userService';
import { Users, Shield, Buildings, WarningCircle, UserPlus, MagnifyingGlass, Trash, PencilSimple } from '@phosphor-icons/react';
import { UserModal } from '../components/users/UserModal';

export const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error al cargar usuarios');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.active !== false && ( // Only show active users
      u.username?.toLowerCase().includes(search.toLowerCase()) || 
      u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      u.id?.toString() === search.replace('#', '')
    )
  );

  const getRoleName = (role: any) => {
    const roleStr = typeof role === 'string' ? role : (role?.name || '');
    return roleStr ? roleStr.replace('ROLE_', '') : 'N/A';
  };

  const getRoleBadgeColor = (role: any) => {
    const roleStr = typeof role === 'string' ? role : (role?.name || '');
    if (roleStr === 'ROLE_ADMIN') return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
    if (roleStr === 'ROLE_BRANCH_MANAGER') return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
  };

  const handleNewUser = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleSaved = () => {
    fetchUsers();
  };

  const handleDeleteUser = async (user: User) => {
    if (window.confirm(`¿Estás seguro de que deseas desactivar/eliminar al usuario @${user.username}?`)) {
      try {
        await userService.deactivateUser(user.id);
        // Remove from list or mark as inactive. We will remove from view.
        setUsers(users.filter(u => u.id !== user.id));
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          alert("Error: " + (err.response?.data?.message || err.message));
        } else {
          alert("Error al eliminar el usuario");
        }
      }
    }
  };

  return (
    <div className="w-full h-full font-sans selection:bg-blue-200 p-2 md:p-8 overflow-y-auto custom-scrollbar">
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center gap-3">
            <Users size={32} weight="duotone" className="text-blue-600" />
            Gestión de Usuarios
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Administra los accesos y roles del personal del sistema</p>
        </div>
        
        <button 
          onClick={handleNewUser}
          className="group bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl flex items-center gap-2 transition-all duration-300 shadow-sm hover:shadow-md active:scale-95 whitespace-nowrap"
        >
          <UserPlus size={20} weight="bold" className="group-hover:scale-110 transition-transform" />
          Nuevo Usuario
        </button>
      </header>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl flex items-center gap-3 font-medium">
          <WarningCircle size={24} weight="duotone" />
          <p>{error}</p>
        </div>
      )}

      {/* Bento Container for Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Directorio de Usuarios</h2>
          
          <div className="relative w-full sm:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlass size={18} className="text-slate-400" weight="bold" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 text-slate-800 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm placeholder:text-slate-400"
              placeholder="Buscar por ID, nombre o usuario..."
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50/50 font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-4">Usuario</th>
                <th className="px-6 py-4">Nombre Completo</th>
                <th className="px-6 py-4">Rol Principal</th>
                <th className="px-6 py-4">Sucursal (ID)</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    Cargando usuarios...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No se encontraron usuarios.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold border border-blue-100 group-hover:bg-blue-100 group-hover:scale-105 transition-all shadow-sm">
                          {u.username?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{u.username}</div>
                          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">ID: #{u.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-slate-700">{u.fullName}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{u.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border ${getRoleBadgeColor(u.roles?.[0])}`}>
                        <Shield size={14} weight="bold" />
                        {getRoleName(u.roles?.[0])}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
                        <Buildings size={16} className="text-slate-400" weight="duotone" />
                        {u.branchId ? `Sucursal #${u.branchId}` : 'Sede Principal (Global)'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEditUser(u)}
                          className="text-slate-500 hover:text-blue-600 bg-white hover:bg-blue-50 p-2 rounded-lg transition-colors border border-slate-200 hover:border-blue-200 shadow-sm"
                          title="Editar Usuario"
                        >
                          <PencilSimple size={18} weight="bold" />
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(u)}
                          className="text-slate-500 hover:text-rose-600 bg-white hover:bg-rose-50 p-2 rounded-lg transition-colors border border-slate-200 hover:border-rose-200 shadow-sm"
                          title="Eliminar Usuario"
                        >
                          <Trash size={18} weight="bold" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <UserModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={handleSaved}
        user={editingUser}
      />
    </div>
  );
};
