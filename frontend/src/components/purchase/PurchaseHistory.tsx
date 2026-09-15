import { useState, useEffect } from 'react';
import { purchaseService } from '../../services/purchaseService';
import type { PurchaseResponse } from '../../types/purchase';

export const PurchaseHistory = () => {
  const [purchases, setPurchases] = useState<PurchaseResponse[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPurchases = async () => {
      setLoading(true);
      try {
        const data = await purchaseService.getPurchases();
        setPurchases(data);
      } finally {
        setLoading(false);
      }
    };
    fetchPurchases();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider">
            <th className="p-4 border-b font-semibold">Fecha</th>
            <th className="p-4 border-b font-semibold">Proveedor</th>
            <th className="p-4 border-b font-semibold">Sucursal (ID)</th>
            <th className="p-4 border-b font-semibold">Responsable</th>
            <th className="p-4 border-b font-semibold text-right">Total</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {loading ? <tr><td colSpan={5} className="p-8 text-center text-slate-500 animate-pulse">Cargando compras...</td></tr> : purchases.map(p => (
            <tr key={p.id} className="border-b last:border-b-0 hover:bg-slate-50/80 transition-colors">
              <td className="p-4 text-slate-600">{new Date(p.purchaseDate).toLocaleDateString()}</td>
              <td className="p-4 font-medium text-slate-900">{p.supplierName}</td>
              <td className="p-4 text-slate-600">Sucursal #{p.branchId}</td>
              <td className="p-4 text-slate-500">{p.responsibleUser}</td>
              <td className="p-4 text-right font-semibold text-emerald-600">${p.totalAmount.toLocaleString()}</td>
            </tr>
          ))}
          {!loading && purchases.length === 0 && (
            <tr><td colSpan={5} className="p-8 text-center text-slate-500">No hay compras registradas</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
