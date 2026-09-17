import React, { useState, useEffect } from 'react';
import type { User } from '../../types/user';
import type { Branch } from '../../types';
import type { UserRegisterDTO, UserUpdateDTO } from '../../types/auth';
import { Role } from '../../types/auth';
import { authService } from '../../services/authService';
import { userService } from '../../services/userService';
import { branchService } from '../../services/branchService';
import { useAuth } from '../../context/AuthContext';
import { X } from '@phosphor-icons/react';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  user?: User | null;
}

export const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, onSaved, user }) => {
  const isEditing = !!user;
  const { user: loggedInUser } = useAuth();
  const isAdmin = loggedInUser?.roles?.includes(Role.ADMIN);
  const isManager = loggedInUser?.roles?.includes(Role.BRANCH_MANAGER);
  
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    role: Role.OPERATOR as string,
    branchId: '' as string | number,
  });

  useEffect(() => {
    if (isOpen) {
      branchService.getAll().then(res => setBranches(res.filter(b => b.active)));
      
      if (isEditing && user) {
        const userRoleStr = typeof user.roles[0] === 'string' ? user.roles[0] : ((user.roles[0] as any)?.name || Role.OPERATOR);
        setFormData({
          username: user.username,
          email: user.email,
          password: '',
          fullName: user.fullName,
          role: userRoleStr,
          branchId: user.branch?.id || user.branchId || '',
        });
      } else {
        setFormData({
          username: '',
          email: '',
          password: '',
          fullName: '',
          role: Role.OPERATOR,
          branchId: isManager && loggedInUser?.branchId ? loggedInUser.branchId : '',
        });
      }
      setError('');
    }
  }, [isOpen, user, isEditing, isManager, loggedInUser]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const bId = formData.role === Role.ADMIN ? null : Number(formData.branchId);

      if (formData.role !== Role.ADMIN && !bId) {
        setError('Debes seleccionar una sucursal para este rol.');
        setLoading(false);
        return;
      }

      if (isEditing && user) {
        const updateData: UserUpdateDTO = {
          username: formData.username,
          email: formData.email,
          fullName: formData.fullName,
          role: formData.role,
          branchId: bId
        };
        await userService.updateUser(user.id, updateData);
      } else {
        const registerData: UserRegisterDTO = {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          role: formData.role,
          branchId: bId
        };
        await authService.register(registerData);
      }
      
      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al guardar el usuario');
    } finally {
      setLoading(false);
    }
  };

  const isAdminSelected = formData.role === Role.ADMIN;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-800">
            {isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X size={20} weight="bold" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Usuario</label>
              <input required type="text" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Nombre Completo</label>
              <input required type="text" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Correo Electrónico</label>
            <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
          </div>

          {!isEditing && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Contraseña</label>
              <input required={!isEditing} type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Rol</label>
              <select required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
                {isAdmin && <option value={Role.ADMIN}>Administrador Global</option>}
                <option value={Role.BRANCH_MANAGER}>Gerente de Sucursal</option>
                <option value={Role.OPERATOR}>Operador / Cajero</option>
              </select>
            </div>
            
            {!isAdminSelected && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Sucursal</label>
                <select 
                  required 
                  value={formData.branchId} 
                  onChange={e => setFormData({...formData, branchId: e.target.value})} 
                  disabled={isManager}
                  className={`w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${isManager ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-slate-50'}`}
                >
                  <option value="" disabled>Seleccionar sucursal...</option>
                  {branches.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
            )}
            
            {isAdminSelected && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1 opacity-50">Sucursal</label>
                <input disabled type="text" value="Acceso Global (Todas)" className="w-full px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed" />
              </div>
            )}
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
            <button type="button" onClick={onClose} disabled={loading} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-semibold">Cancelar</button>
            <button type="submit" disabled={loading} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors font-semibold flex items-center gap-2">
              {loading && <div className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full"></div>}
              {isEditing ? 'Guardar Cambios' : 'Crear Usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
