import { useState, useEffect } from 'react';
import { Truck, Clock, Checks, XCircle, Path, DownloadSimple, User, MagnifyingGlass } from '@phosphor-icons/react';
import type { Branch } from '../../types';
import type { TransferResponse } from '../../types/transfer';
import { branchService } from '../../services/branchService';
import { transferService } from '../../services/transferService';
import { TransferReceiveForm } from './TransferReceiveForm';
import { Dropdown } from '../ui/Dropdown';

export const TransferHistory = ({ refreshTrigger }: { refreshTrigger: number }) => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [transfers, setTransfers] = useState<TransferResponse[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
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

  const filteredTransfers = transfers.filter(t => 
    t.originBranchName.toLowerCase().includes(search.toLowerCase()) || 
    t.destinationBranchName.toLowerCase().includes(search.toLowerCase()) ||
    t.responsibleUser.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'IN_TRANSIT': 
        return { 
          icon: <Truck size={14} weight="bold" />, 
          text: 'EN TRÁNSITO', 
          color: 'bg-blue-100 text-blue-700 border-blue-200',
          line: 'border-blue-400 border-dashed',
          marker: 'bg-blue-400'
        };
      case 'COMPLETED': 
        return { 
          icon: <Checks size={14} weight="bold" />, 
          text: 'COMPLETADA', 
          color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
          line: 'border-emerald-500 border-solid',
          marker: 'bg-emerald-500'
        };
      case 'PARTIAL': 
        return { 
          icon: <Clock size={14} weight="bold" />, 
          text: 'PARCIAL', 
          color: 'bg-amber-100 text-amber-700 border-amber-200',
          line: 'border-amber-400 border-dashed',
          marker: 'bg-amber-400'
        };
      case 'CANCELLED': 
        return { 
          icon: <XCircle size={14} weight="bold" />, 
          text: 'CANCELADA', 
          color: 'bg-rose-100 text-rose-700 border-rose-200',
          line: 'border-rose-300 border-solid',
          marker: 'bg-rose-500'
        };
      default: 
        return { 
          icon: <Clock size={14} weight="bold" />, 
          text: 'DESCONOCIDO', 
          color: 'bg-slate-100 text-slate-700 border-slate-200',
          line: 'border-slate-300 border-dashed',
          marker: 'bg-slate-400'
        };
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 xl:p-8 animate-in fade-in duration-300">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-slate-100 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
            <Path size={24} weight="duotone" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Seguimiento de Transferencias</h2>
            <p className="text-sm text-slate-500 font-medium">Monitoreo y recepción de envíos.</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
            <MagnifyingGlass size={18} className="text-slate-400" weight="bold" />
            <input 
              type="text" 
              placeholder="Buscar origen, destino..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full sm:w-48 bg-transparent border-none text-slate-700 text-sm font-medium p-2.5 outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="w-full sm:w-64 z-40 relative">
            <Dropdown
              options={branches.map(b => ({ value: b.id as number, label: b.name }))}
              value={selectedBranch || ''}
              onChange={(val) => setSelectedBranch(Number(val))}
              placeholder={branches.length === 0 ? "Cargando..." : "Selecciona una sucursal"}
              themeColor="#3b82f6" // blue-500
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center text-blue-600">
          <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
          <p className="font-bold text-slate-500">Cargando seguimiento...</p>
        </div>
      ) : filteredTransfers.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
          <Truck size={48} weight="duotone" className="text-slate-300 mb-3" />
          <p className="font-medium text-slate-500">No hay transferencias registradas.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {filteredTransfers.map((transfer) => {
            const isDestination = transfer.destinationBranchId === selectedBranch;
            const canReceive = isDestination && transfer.status === 'IN_TRANSIT';
            const statusStyle = getStatusConfig(transfer.status);

            return (
              <div key={transfer.id} className="bg-white border border-slate-200 rounded-2xl hover:border-blue-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden group">
                
                {/* Journey Timeline */}
                <div className="bg-slate-50/80 p-5 border-b border-slate-100">
                  <div className="flex justify-between items-center mb-6">
                    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${statusStyle.color}`}>
                      {statusStyle.icon}
                      {statusStyle.text}
                    </span>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">ID Transferencia</span>
                      <span className="text-sm font-black text-slate-700">TR-{transfer.id.toString().padStart(5, '0')}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between relative px-2">
                    {/* Línea conectora */}
                    <div className={`absolute top-1/2 left-8 right-8 h-0 border-t-2 ${statusStyle.line} -translate-y-1/2 z-0`}></div>
                    
                    {/* Nodo Origen */}
                    <div className="relative z-10 flex flex-col items-center bg-slate-50 px-2">
                      <div className="w-4 h-4 rounded-full border-4 border-slate-300 bg-white mb-2"></div>
                      <span className="text-xs font-black text-slate-400 uppercase tracking-wider mb-0.5">Origen</span>
                      <span className="font-bold text-slate-800 text-sm max-w-[100px] text-center truncate">{transfer.originBranchName}</span>
                    </div>
                    
                    {/* Vehículo (En el medio) */}
                    <div className="relative z-10 bg-slate-50 px-3">
                      <div className={`p-2 rounded-full text-white ${statusStyle.marker} shadow-sm group-hover:scale-110 transition-transform`}>
                        <Truck size={16} weight="fill" />
                      </div>
                    </div>

                    {/* Nodo Destino */}
                    <div className="relative z-10 flex flex-col items-center bg-slate-50 px-2">
                      <div className={`w-4 h-4 rounded-full border-4 mb-2 ${transfer.status === 'COMPLETED' ? 'border-emerald-500 bg-white' : 'border-slate-300 bg-white'}`}></div>
                      <span className="text-xs font-black text-slate-400 uppercase tracking-wider mb-0.5">Destino</span>
                      <span className="font-bold text-slate-800 text-sm max-w-[100px] text-center truncate">{transfer.destinationBranchName}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 mt-6 pt-4 border-t border-slate-200/60 text-slate-500">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User size={14} weight="bold" />
                        <span className="text-xs font-semibold">Emitido por: {transfer.responsibleUser}</span>
                      </div>
                      <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded uppercase font-bold">{transfer.routePriority || 'ESTANDAR'}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-1.5">
                        <Truck size={14} weight="duotone" className="text-blue-500" />
                        <span className="font-semibold text-slate-600">{transfer.transporter || 'N/A'}</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[9px] uppercase font-bold text-slate-400">Llegada Estimada</span>
                        <span className="font-bold text-blue-600">{transfer.estimatedArrival ? new Date(transfer.estimatedArrival).toLocaleDateString() : 'Pendiente'}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Product Detail List */}
                <div className="p-5 flex-1 flex flex-col bg-white">
                  <div className="flex justify-between items-end mb-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cargamento</h4>
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">{transfer.details.length} Items</span>
                  </div>
                  
                  <div className="space-y-2 flex-1 overflow-y-auto custom-scrollbar max-h-40 pr-2">
                    {transfer.details.map(detail => (
                      <div key={detail.id} className="flex justify-between items-center bg-slate-50/50 p-2.5 rounded-xl border border-slate-100 hover:border-blue-100 transition-colors">
                        <p className="font-semibold text-slate-700 text-sm truncate flex-1 pr-3">{detail.productName}</p>
                        <div className="flex items-center gap-4 text-right">
                          <div className="flex flex-col items-end">
                            <span className="text-[10px] text-slate-400 font-bold uppercase">Enviado</span>
                            <span className="font-bold text-slate-600 text-sm">{detail.quantitySent}</span>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-[10px] text-slate-400 font-bold uppercase">Recibido</span>
                            {detail.quantityReceived !== null 
                              ? <span className={`font-bold text-sm ${detail.quantityReceived < detail.quantitySent ? 'text-amber-500' : 'text-emerald-500'}`}>{detail.quantityReceived}</span>
                              : <span className="text-slate-300 font-black text-sm">-</span>
                            }
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {canReceive && (
                    <button 
                      onClick={() => setReceivingTransfer(transfer)}
                      className="mt-4 w-full bg-blue-600 hover:bg-blue-500 text-white py-3.5 rounded-xl font-bold text-sm transition-all shadow-[0_0_15px_rgba(37,99,235,0.2)] flex justify-center items-center gap-2"
                    >
                      <DownloadSimple size={18} weight="bold" />
                      Registrar Recepción
                    </button>
                  )}
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
