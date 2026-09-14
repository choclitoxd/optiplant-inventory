import React, { useEffect, useState } from 'react';
import type { PurchaseResponse } from '../types/purchase';
import { PurchaseService } from '../services/api';

export const PurchaseHistory = ({ refreshTrigger }: { refreshTrigger: number }) => {
  const [purchases, setPurchases] = useState<PurchaseResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    PurchaseService.getAll().then(setPurchases).finally(() => setLoading(false));
  }, [refreshTrigger]);

  if (loading) return <div className="p-8 text-center text-slate-500">Cargando historial...</div>;

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-xl font-semibold text-slate-800">Historial de Compras</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-sm font-semibold text-slate-500">
              <th className="py-3 px-6">ID / Fecha</th>
              <th className="py-3 px-6">Proveedor</th>
              <th className="py-3 px-6">Responsable</th>
              <th className="py-3 px-6 text-right">Total</th>
              <th className="py-3 px-6 text-center">Detalle</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {purchases.map(p => (
              <React.Fragment key={p.id}>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-semibold text-slate-800">#{p.id}</div>
                    <div className="text-xs text-slate-400">{new Date(p.purchaseDate).toLocaleDateString()}</div>
                  </td>
                  <td className="py-4 px-6 font-medium text-slate-700">{p.supplierName}</td>
                  <td className="py-4 px-6 text-slate-600">{p.responsibleUser}</td>
                  <td className="py-4 px-6 text-right font-bold text-emerald-600">${p.totalAmount.toFixed(2)}</td>
                  <td className="py-4 px-6 text-center">
                    <button onClick={() => setExpandedId(expandedId === p.id ? null : p.id)} className="text-indigo-600 hover:bg-indigo-50 px-3 py-1 rounded-lg text-sm font-medium transition-colors">
                      {expandedId === p.id ? 'Ocultar' : 'Ver'}
                    </button>
                  </td>
                </tr>
                {expandedId === p.id && (
                  <tr className="bg-slate-50/50">
                    <td colSpan={5} className="py-4 px-6">
                      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                        <h4 className="text-sm font-semibold text-slate-700 mb-3 border-b pb-2">Artículos Comprados</h4>
                        <ul className="space-y-2">
                          {p.details.map(d => (
                            <li key={d.productId} className="flex justify-between text-sm">
                              <span className="text-slate-600"><span className="font-medium">[{d.productSku}]</span> {d.productName}</span>
                              <span className="text-slate-800 font-medium">{d.quantity} x ${d.unitCost.toFixed(2)} = ${(d.quantity * d.unitCost).toFixed(2)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
            {purchases.length === 0 && <tr><td colSpan={5} className="text-center py-10 text-slate-400">No hay compras registradas en el sistema.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};
