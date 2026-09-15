import { useState, useEffect } from 'react';
import type { Branch } from '../../types';
import type { SaleResponse } from '../../types/sale';
import { branchService } from '../../services/branchService';
import { saleService } from '../../services/saleService';

export const SalesHistory = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [sales, setSales] = useState<SaleResponse[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<number>(0);
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200 p-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-semibold text-slate-800 tracking-tight">Historial de Ventas</h2>
        <select 
          className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block w-full md:w-64 p-2.5 outline-none font-medium"
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(Number(e.target.value))}
        >
          {branches.length === 0 && <option value={0}>Cargando...</option>}
          {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="h-40 flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full"></div></div>
      ) : sales.length === 0 ? (
        <div className="text-center py-10 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">No hay ventas registradas en esta sucursal.</div>
      ) : (
        <div className="space-y-4">
          {sales.map((sale) => (
            <div key={sale.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
              <div className="bg-slate-50 px-5 py-4 border-b border-slate-100 flex flex-col md:flex-row justify-between md:items-center gap-3">
                <div>
                  <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Ticket #{sale.id.toString().padStart(6, '0')}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-slate-800 font-medium">Cajero: {sale.responsibleUser}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-500 text-sm">{new Date(sale.saleDate).toLocaleString()}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm text-slate-500 block">Total de Venta</span>
                  <span className="text-xl font-black text-emerald-600">${sale.totalAmount.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="p-5">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      <th className="pb-3 pr-4">Producto</th>
                      <th className="pb-3 px-4 text-center">Cant.</th>
                      <th className="pb-3 px-4 text-right">Precio Unit.</th>
                      <th className="pb-3 pl-4 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {sale.details.map(detail => (
                      <tr key={detail.id} className="group">
                        <td className="py-3 pr-4 font-medium text-slate-700 group-hover:text-indigo-600 transition-colors">{detail.productName}</td>
                        <td className="py-3 px-4 text-center font-semibold text-slate-600">{detail.quantity}</td>
                        <td className="py-3 px-4 text-right text-slate-500">${detail.unitPrice.toFixed(2)}</td>
                        <td className="py-3 pl-4 text-right font-medium text-slate-800">${detail.subtotal.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
