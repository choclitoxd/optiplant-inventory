import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Leaf, LockKey, User as UserIcon, WarningCircle, CircleNotch } from '@phosphor-icons/react';

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login({ username, password });
      navigate('/dashboard', { replace: true });
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Credenciales inválidas. Por favor intente nuevamente.');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocurrió un error inesperado. Intente nuevamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4">
      {/* Bento Grid Central Container */}
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
        
        {/* Subtle background glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl mix-blend-screen pointer-events-none" />
        
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-900/50">
            <Leaf size={32} weight="fill" className="text-white" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">OptiPlant ERP</h1>
          <p className="text-slate-400 text-sm">Ingrese sus credenciales para continuar</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-800 rounded-2xl flex items-start gap-3">
            <WarningCircle size={20} className="text-red-400 shrink-0 mt-0.5" />
            <p className="text-sm text-red-200">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-300 ml-1">Usuario</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <UserIcon size={20} className="text-slate-500" />
              </div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-slate-700 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-slate-600"
                placeholder="ej: admin, cajero_bogota"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-300 ml-1">Contraseña</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <LockKey size={20} className="text-slate-500" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-slate-700 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-slate-600"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold rounded-2xl shadow-lg shadow-emerald-900/20 transition-all duration-200 flex items-center justify-center gap-2 mt-8 disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden"
          >
            {isLoading ? (
              <CircleNotch size={20} className="animate-spin" />
            ) : (
              <span className="relative z-10">Ingresar al Sistema</span>
            )}
            {/* Hover shine effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1s_forwards] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0" />
          </button>
        </form>
      </div>
      
      <p className="text-slate-500 text-sm mt-8">© 2026 OptiPlant Consultores.</p>
    </div>
  );
};
