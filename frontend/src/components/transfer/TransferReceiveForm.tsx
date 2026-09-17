import { useState } from 'react';
import type { TransferResponse } from '../../types/transfer';
import { transferService } from '../../services/transferService';
import { Warning } from '@phosphor-icons/react';

export const TransferReceiveForm = ({ transfer, onSuccess, onCancel }: { transfer: TransferResponse, onSuccess: () => void, onCancel: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Initialize received quantities tracking
  const [receivedMap, setReceivedMap] = useState<Record<number, number>>(() => {
    const initial: Record<number, number> = {};
    transfer.details.forEach(d => initial[d.id] = d.quantitySent); // Default to receiving all
    return initial;
  });

  const handleReceive = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      await transferService.receiveTransfer(transfer.id, {
        details: transfer.details.map(d => ({
          detailId: d.id,
          quantityReceived: receivedMap[d.id] || 0
        }))
      });
      onSuccess();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || "Error al procesar recepción.");
    } finally {
      setLoading(false);
    }
  };

  const hasDiscrepancy = transfer.details.some(d => (receivedMap[d.id] || 0) < d.quantitySent);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Recibir Transferencia #{transfer.id}</h2>
            <p className="text-sm text-slate-500 mt-1">Origen: {transfer.originBranchName}</p>
          </div>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {errorMsg && <div className="mb-4 bg-rose-50 text-rose-600 p-3 rounded-lg border border-rose-200 text-sm">{errorMsg}</div>}

          <h3 className="font-semibold text-slate-700 mb-3">Conteo Físico</h3>
          <div className="space-y-3">
            {transfer.details.map(d => {
              const rQty = receivedMap[d.id] ?? 0;
              const isShort = rQty < d.quantitySent;
              
              return (
                <div key={d.id} className={`p-4 rounded-xl border flex items-center justify-between ${isShort ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-200'}`}>
                  <div>
                    <div className="font-medium text-slate-800">{d.productName}</div>
                    <div className="text-sm text-slate-500 mt-1">Enviado: {d.quantitySent}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-slate-600">Recibido:</span>
                    <input 
                      type="number" 
                      min="0"
                      max={d.quantitySent}
                      value={rQty}
                      onChange={(e) => {
                        const val = Math.max(0, Math.min(d.quantitySent, parseInt(e.target.value) || 0));
                        setReceivedMap(prev => ({...prev, [d.id]: val}));
                      }}
                      className="w-20 p-2 text-center rounded-lg border border-slate-300 outline-none focus:border-indigo-500 font-bold"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {hasDiscrepancy && (
            <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium">
              <Warning size={16} weight="bold" className="inline-block mr-1 -mt-0.5" /> Atención: Se han detectado discrepancias. La orden se marcará como PARCIAL y se generará un asiento de Faltante en el Kardex para auditoría.
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button onClick={onCancel} className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-200 rounded-xl transition-colors">Cancelar</button>
          <button 
            onClick={handleReceive} 
            disabled={loading}
            className={`px-5 py-2.5 text-white font-bold rounded-xl transition-colors ${hasDiscrepancy ? 'bg-amber-500 hover:bg-amber-600 shadow-lg shadow-amber-500/30' : 'bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/30'}`}
          >
            {loading ? 'Guardando...' : hasDiscrepancy ? 'Confirmar Recepción Incompleta' : 'Confirmar Recepción Completa'}
          </button>
        </div>
      </div>
    </div>
  );
};
