import { useState, useEffect } from 'react';
import { purchaseService } from '../../services/purchaseService';
import type { Supplier } from '../../types/supplier';

export const SupplierManager = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Supplier>({ taxId: '', companyName: '', contactName: '', phone: '' });

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const data = await purchaseService.getSuppliers();
      setSuppliers(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSuppliers(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await purchaseService.createSupplier(formData);
    setFormData({ taxId: '', companyName: '', contactName: '', phone: '' });
    fetchSuppliers();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 transition-all hover:shadow-md">
        <h3 className="text-lg font-medium text-slate-800 mb-4">Nuevo Proveedor</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="border border-slate-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50 focus:bg-white text-sm" placeholder="RUT / Tax ID" required value={formData.taxId} onChange={e => setFormData({...formData, taxId: e.target.value})} />
          <input className="border border-slate-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50 focus:bg-white text-sm" placeholder="Razón Social" required value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} />
          <input className="border border-slate-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50 focus:bg-white text-sm" placeholder="Contacto (Opcional)" value={formData.contactName} onChange={e => setFormData({...formData, contactName: e.target.value})} />
          <input className="border border-slate-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50 focus:bg-white text-sm" placeholder="Teléfono (Opcional)" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
        </div>
        <button type="submit" className="mt-5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium py-2 px-5 rounded-md transition-colors shadow-sm">
          Guardar Proveedor
        </button>
      </form>
      
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider">
              <th className="p-4 border-b font-semibold">Tax ID</th>
              <th className="p-4 border-b font-semibold">Razón Social</th>
              <th className="p-4 border-b font-semibold">Contacto</th>
              <th className="p-4 border-b font-semibold">Teléfono</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {loading ? <tr><td colSpan={4} className="p-8 text-center text-slate-500 animate-pulse">Cargando proveedores...</td></tr> : suppliers.map(s => (
              <tr key={s.id} className="border-b last:border-b-0 hover:bg-slate-50/80 transition-colors">
                <td className="p-4 font-mono text-slate-600">{s.taxId}</td>
                <td className="p-4 font-medium text-slate-900">{s.companyName}</td>
                <td className="p-4 text-slate-500">{s.contactName || '-'}</td>
                <td className="p-4 text-slate-500">{s.phone || '-'}</td>
              </tr>
            ))}
            {!loading && suppliers.length === 0 && (
              <tr><td colSpan={4} className="p-8 text-center text-slate-500">No hay proveedores registrados</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
