import { useEffect, useState } from 'react';
import type { Supplier, SupplierRequest } from '../types/supplier';
import { SupplierService } from '../services/api';

export const SupplierManager = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<SupplierRequest>({ taxId: '', companyName: '', contactName: '', phone: '' });

  const loadSuppliers = () => {
    setLoading(true);
    SupplierService.getAll().then(setSuppliers).finally(() => setLoading(false));
  };

  useEffect(() => { loadSuppliers(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await SupplierService.create(formData);
      setIsModalOpen(false);
      setFormData({ taxId: '', companyName: '', contactName: '', phone: '' });
      loadSuppliers();
    } catch (err) {
      alert("Error al guardar el proveedor. Revisa si el Tax ID ya existe.");
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-slate-800">Directorio de Proveedores</h2>
        <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-medium transition-colors shadow-sm">
          + Nuevo Proveedor
        </button>
      </div>

      {loading ? (
        <div className="animate-pulse flex space-x-4"><div className="flex-1 space-y-4 py-1"><div className="h-4 bg-slate-200 rounded w-3/4"></div><div className="space-y-2"><div className="h-4 bg-slate-200 rounded"></div></div></div></div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-y border-slate-200 text-sm font-semibold text-slate-500">
                <th className="py-3 px-4">Tax ID</th>
                <th className="py-3 px-4">Razón Social</th>
                <th className="py-3 px-4">Contacto</th>
                <th className="py-3 px-4">Teléfono</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {suppliers.map(s => (
                <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4 font-medium">{s.taxId}</td>
                  <td className="py-3 px-4">{s.companyName}</td>
                  <td className="py-3 px-4 text-slate-600">{s.contactName}</td>
                  <td className="py-3 px-4 text-slate-600">{s.phone}</td>
                </tr>
              ))}
              {suppliers.length === 0 && <tr><td colSpan={4} className="text-center py-8 text-slate-400">No hay proveedores registrados.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-slate-800">Registrar Proveedor</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-xl font-bold">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Tax ID (RUT/RFC) *</label><input required value={formData.taxId} onChange={e => setFormData({...formData, taxId: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Razón Social *</label><input required value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Nombre Contacto</label><input value={formData.contactName} onChange={e => setFormData({...formData, contactName: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label><input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors font-medium shadow-sm">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
