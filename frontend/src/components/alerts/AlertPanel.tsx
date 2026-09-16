import type { StockAlert } from '../../types/stockAlert';
import { Envelope, WarningCircle, CheckCircle, Circle } from '@phosphor-icons/react';

interface AlertPanelProps {
  alerts: StockAlert[];
  onOpenEmailModal: () => void;
}

export const AlertPanel = ({ alerts, onOpenEmailModal }: AlertPanelProps) => {
  const criticalCount = alerts.filter(a => a.severity === 'CRITICAL').length;
  const warningCount = alerts.filter(a => a.severity === 'WARNING').length;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-500">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <WarningCircle size={24} weight="duotone" className="text-rose-500" /> Alertas Inteligentes de Stock
          </h2>
          <div className="flex items-center gap-4 mt-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              {criticalCount} Críticas (Stock 0)
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold border border-amber-200">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              {warningCount} Advertencias
            </span>
          </div>
        </div>
        <button 
          onClick={onOpenEmailModal}
          className="flex items-center gap-2 bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-slate-700 shadow-sm transition-all"
        >
          <Envelope size={18} weight="bold" /> Enviar Reporte por Correo
        </button>
      </div>

      {alerts.length === 0 ? (
        <div className="p-12 text-center flex flex-col items-center">
          <CheckCircle size={48} weight="duotone" className="text-emerald-500 mb-4" />
          <h3 className="text-lg font-bold text-slate-700">El inventario está sano</h3>
          <p className="text-slate-500">No se detectaron niveles bajos de stock en la red.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-xs border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-semibold">Severidad</th>
                <th className="px-6 py-4 font-semibold">Producto / SKU</th>
                <th className="px-6 py-4 font-semibold">Sucursal</th>
                <th className="px-6 py-4 font-semibold text-center">Stock Actual</th>
                <th className="px-6 py-4 font-semibold text-center">Sugerido Comprar</th>
                <th className="px-6 py-4 font-semibold text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {alerts.map((alert) => (
                <tr key={alert.inventoryId} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    {alert.severity === 'CRITICAL' ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 text-xs font-bold border border-rose-100">
                        <Circle size={10} weight="fill" className="mr-1.5" /> CRITICAL
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 text-xs font-bold border border-amber-100">
                        <Circle size={10} weight="fill" className="mr-1.5" /> WARNING
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-800">{alert.productName}</p>
                    <p className="text-xs text-slate-400 font-medium">SKU: {alert.productSku}</p>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-600">{alert.branchName}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-lg font-black ${alert.severity === 'CRITICAL' ? 'text-rose-600' : 'text-amber-600'}`}>
                      {alert.currentStock}
                    </span>
                    <span className="text-xs text-slate-400 block font-medium">Min: {alert.minStockThreshold}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex justify-center items-center w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 font-bold border border-emerald-200">
                      +{alert.suggestedReorderQuantity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-blue-600 font-bold hover:text-blue-800 hover:underline text-sm transition-all opacity-0 group-hover:opacity-100">
                      Abastecer →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
