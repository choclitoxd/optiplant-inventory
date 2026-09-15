import { useState, useEffect } from 'react';
import type { Branch } from '../../types';
import type { TransferResponse } from '../../types/transfer';
import { branchService } from '../../services/branchService';
import { transferService } from '../../services/transferService';
import { TransferReceiveForm } from './TransferReceiveForm';

export const TransferHistory = ({ refreshTrigger }: { refreshTrigger: number }) => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [transfers, setTransfers] = useState<TransferResponse[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [receivingTransfer, setReceivingTransfer] = useState<TransferResponse | null>(null);

  useEffect(() => {
    branchService.getAll().then(res => {
      setBranches(res);
      if(res.length > 0) setSelectedBranch(res[0].id);
    });
  }, []);

  const loadTransfers = () => {
    if (selectedBranch > 0) {
      setLoading(true);
      transferService.getTransfersByBranch(selectedBranch)
        .then(setTransfers)
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    loadTransfers();
  }, [selectedBranch, refreshTrigger]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'IN_TRANSIT': return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold tracking-wide">EN TRÁNSITO</span>;
      case 'COMPLETED': return <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold tracking-wide">COMPLETA</span>;
      case 'PARTIAL': return <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold tracking-wide">PARCIAL (MERMA)</span>;
      case 'CANCELLED': return <span className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-bold tracking-wide">CANCELADA</span>;
      default: return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 animate-in fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-xl font-bold text-slate-800">Historial de Transferencias</h2>
        <select 
          className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl p-2.5 outline-none font-medium min-w-[200px]"
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(Number(e.target.value))}
        >
          {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 font-medium animate-pulse">Cargando movimientos...</div>
      ) : transfers.length === 0 ? (
        <div className="py-20 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">No hay transferencias registradas.</div>
      ) : (
        <div className="space-y-4">
          {transfers.map((transfer) => {
            const isDestination = transfer.destinationBranchId === selectedBranch;
            const canReceive = isDestination && transfer.status === 'IN_TRANSIT';

            return (
              <div key={transfer.id} className="border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                <div className="bg-slate-50 px-5 py-4 border-b border-slate-100 flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Origen</span>
                      <span className="font-semibold text-slate-800">{transfer.originBranchName}</span>
                    </div>
                    <div className="text-slate-300">➔</div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Destino</span>
                      <span className="font-semibold text-slate-800">{transfer.destinationBranchName}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden md:block">
                      <span className="text-xs text-slate-500 block">Enviado: {new Date(transfer.sendDate).toLocaleDateString()}</span>
                      <span className="text-xs font-medium text-slate-700 block max-w-[200px] truncate" title={transfer.responsibleUser}>{transfer.responsibleUser}</span>
                    </div>
                    {getStatusBadge(transfer.status)}
                    {canReceive && (
                      <button 
                        onClick={() => setReceivingTransfer(transfer)}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-lg shadow-sm transition-colors"
                      >
                        Recibir
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="p-5">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider">
                        <th className="pb-2 font-semibold">Producto</th>
                        <th className="pb-2 font-semibold text-center">Cant. Enviada</th>
                        <th className="pb-2 font-semibold text-center">Cant. Recibida</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {transfer.details.map(detail => (
                        <tr key={detail.id}>
                          <td className="py-2 font-medium text-slate-700">{detail.productName}</td>
                          <td className="py-2 text-center text-slate-600 font-semibold">{detail.quantitySent}</td>
                          <td className="py-2 text-center">
                            {detail.quantityReceived !== null 
                              ? <span className={`font-bold ${detail.quantityReceived < detail.quantitySent ? 'text-amber-500' : 'text-emerald-500'}`}>{detail.quantityReceived}</span>
                              : <span className="text-slate-300">-</span>
                            }
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {receivingTransfer && (
        <TransferReceiveForm 
          transfer={receivingTransfer} 
          onSuccess={() => {
            setReceivingTransfer(null);
            loadTransfers();
          }}
          onCancel={() => setReceivingTransfer(null)}
        />
      )}
    </div>
  );
};
