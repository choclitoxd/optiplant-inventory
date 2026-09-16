import type { StockValueByBranch } from '../../types/dashboard';
import { Buildings } from '@phosphor-icons/react';

export const BranchValueTable = ({ data, totalValue }: { data: StockValueByBranch[], totalValue: number }) => {
  const formatCurrency = (val: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(val);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-700">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Buildings size={20} weight="duotone" className="text-indigo-500" /> Valorización por Sucursal
        </h2>
        <p className="text-sm text-slate-500 mt-1">Distribución del capital invertido en inventario local.</p>
      </div>
      
      {data.length === 0 ? (
        <div className="p-8 text-center text-slate-400 font-medium">No hay datos de sucursales disponibles.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-xs border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-semibold">Sucursal</th>
                <th className="px-6 py-4 font-semibold text-center">Unidades</th>
                <th className="px-6 py-4 font-semibold text-right">Valor Total</th>
                <th className="px-6 py-4 font-semibold">% del Global</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.map((row) => {
                const percentage = totalValue > 0 ? (row.totalValue / totalValue) * 100 : 0;
                
                return (
                  <tr key={row.branchId} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-700">{row.branchName}</td>
                    <td className="px-6 py-4 text-center font-medium text-slate-600">{row.totalItems.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right font-bold text-slate-800">{formatCurrency(row.totalValue)}</td>
                    <td className="px-6 py-4 w-48">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                          <div 
                            className="h-full bg-indigo-500 rounded-full" 
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-500 w-10 text-right">{percentage.toFixed(1)}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
