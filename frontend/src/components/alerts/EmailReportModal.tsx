import { useState } from 'react';
import { alertService } from '../../services/alertService';
import { Envelope, CheckCircle, XCircle } from '@phosphor-icons/react';

interface EmailReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmailReportModal = ({ isOpen, onClose }: EmailReportModalProps) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await alertService.sendEmailReport(email);
      setStatus('success');
      setTimeout(() => {
        setStatus('idle');
        onClose();
      }, 2000);
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-800">Enviar Reporte de Alertas</h2>
          <p className="text-sm text-slate-500 mt-1">Se enviará un reporte detallado al administrador.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Correo Destinatario</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@optiplant.com"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
            />
          </div>

          {status === 'success' && (
            <div className="mb-4 p-3 bg-emerald-50 text-emerald-600 rounded-lg text-sm font-medium border border-emerald-100">
              <CheckCircle size={18} weight="bold" className="inline mr-1" /> Reporte enviado exitosamente.
            </div>
          )}
          {status === 'error' && (
            <div className="mb-4 p-3 bg-rose-50 text-rose-600 rounded-lg text-sm font-medium border border-rose-100">
              <XCircle size={18} weight="bold" className="inline mr-1" /> Ocurrió un error al enviar el correo.
            </div>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <button 
              type="button" 
              onClick={onClose}
              disabled={status === 'loading'}
              className="px-5 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={status === 'loading'}
              className="px-5 py-2.5 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {status === 'loading' ? 'Enviando...' : <><Envelope size={18} weight="bold" className="mr-1" /> Enviar Reporte</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
