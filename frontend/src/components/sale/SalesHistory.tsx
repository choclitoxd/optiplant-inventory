import { useState, useEffect } from 'react';
import { Receipt, CalendarBlank, User, Storefront, MagnifyingGlass } from '@phosphor-icons/react';
import type { Branch } from '../../types';
import type { SaleResponse } from '../../types/sale';
import { branchService } from '../../services/branchService';
import { saleService } from '../../services/saleService';
import { Dropdown } from '../ui/Dropdown';

export const SalesHistory = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [sales, setSales] = useState<SaleResponse[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    branchService.getAll().then(res => {
      setBranches(res);
      if(res.length > 0) setSelectedBranch(res[0].id);
    });
  }, []);

  useEffect(() => {
    if (selectedBranch > 0) {
      setLoading(true);
      saleService.getSalesByBranch(selectedBranch)
        .then(setSales)
        .finally(() => setLoading(false));
    }
  }, [selectedBranch]);

  const filteredSales = sales.filter(s => 
    s.id.toString().includes(search) || 
    s.responsibleUser.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 xl:p-8 animate-in fade-in duration-300">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-slate-100 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
            <Receipt size={24} weight="duotone" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Historial de Ventas</h2>
            <p className="text-sm text-slate-500 font-medium">Registro de todos los tickets emitidos.</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all">
            <MagnifyingGlass size={18} className="text-slate-400" weight="bold" />
            <input 
              type="text" 
              placeholder="Buscar ticket o cajero..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full sm:w-48 bg-transparent border-none text-slate-700 text-sm font-medium p-2.5 outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all">
            <Storefront size={18} className="text-slate-400" weight="bold" />
          <div className="w-full sm:w-48">
            <Dropdown
              options={branches.length === 0 ? [] : branches.map(b => ({ value: b.id as number, label: b.name }))}
              value={selectedBranch || ''}
              onChange={(val) => setSelectedBranch(Number(val))}
              placeholder={branches.length === 0 ? "Cargando..." : "Seleccione sucursal"}
              themeColor="#10b981"
              className="bg-transparent text-slate-700 font-medium"
            />
          </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center text-emerald-600">
          <div className="animate-spin h-10 w-10 border-4 border-emerald-600 border-t-transparent rounded-full mb-4"></div>
          <p className="font-bold text-slate-500">Cargando historial...</p>
        </div>
      ) : filteredSales.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
          <Receipt size={48} weight="duotone" className="text-slate-300 mb-3" />
          <p className="font-medium text-slate-500">No se encontraron ventas registradas.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
          {filteredSales.map((sale) => (
            <div key={sale.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-emerald-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col">
              
              {/* Card Header */}
              <div className="bg-slate-50/80 px-5 py-4 border-b border-slate-100 flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-black text-slate-400 bg-white border border-slate-200 px-2.5 py-1 rounded-md uppercase tracking-widest shadow-sm">
                    Ticket #{sale.id.toString().padStart(6, '0')}
                  </span>
                  <div className="flex items-center gap-2 mt-3 text-slate-600">
                    <User size={16} weight="bold" />
                    <span className="font-semibold text-sm truncate">{sale.responsibleUser}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-slate-400">
                    <CalendarBlank size={14} weight="bold" />
                    <span className="text-xs font-medium">{new Date(sale.saleDate).toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Venta</span>
                  <span className="text-2xl font-black text-emerald-600 tracking-tight block leading-none">
                    ${sale.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
              
              {/* Card Body (Products) */}
              <div className="p-5 flex-1 flex flex-col">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Detalle de Productos</h4>
                <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar max-h-48 pr-2">
                  {sale.details.map(detail => (
                    <div key={detail.id} className="flex justify-between items-center bg-slate-50/50 p-2.5 rounded-xl border border-slate-100 group-hover:bg-white group-hover:border-emerald-100 transition-colors">
                      <div className="flex-1 min-w-0 pr-3">
                        <p className="font-semibold text-slate-700 text-sm truncate">{detail.productName}</p>
                        <p className="text-xs text-slate-400 font-medium">${detail.unitPrice.toFixed(2)} c/u</p>
                      </div>
                      <div className="text-right flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-500 bg-slate-200/50 px-2 py-0.5 rounded-md">x{detail.quantity}</span>
                        <span className="font-black text-slate-700 text-sm w-16">${detail.subtotal.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};
