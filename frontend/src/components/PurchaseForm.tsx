import { useEffect, useState } from 'react';
import type { PurchaseRequest, PurchaseDetailRequest } from '../types/purchase';
import type { Supplier } from '../types/supplier';
import type { Product, Branch } from '../types';
import { SupplierService, ProductService, BranchService, PurchaseService } from '../services/api';

export const PurchaseForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  
  const [branchId, setBranchId] = useState<number>(0);
  const [supplierId, setSupplierId] = useState<number>(0);
  const [responsibleUser, setResponsibleUser] = useState('');
  const [details, setDetails] = useState<PurchaseDetailRequest[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    SupplierService.getAll().then(setSuppliers);
    ProductService.getAll().then(setProducts);
    BranchService.getAll().then(setBranches);
  }, []);

  const addDetailRow = () => {
    setDetails([...details, { productId: 0, quantity: 1, unitCost: 0 }]);
  };

  const updateDetail = (index: number, field: keyof PurchaseDetailRequest, value: number) => {
    const newDetails = [...details];
    newDetails[index] = { ...newDetails[index], [field]: value };
    setDetails(newDetails);
  };

  const removeDetail = (index: number) => {
    setDetails(details.filter((_, i) => i !== index));
  };

  const totalAmount = details.reduce((sum, d) => sum + (d.quantity * d.unitCost), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!branchId || !supplierId || !responsibleUser || details.length === 0 || details.some(d => !d.productId || d.quantity <= 0 || d.unitCost <= 0)) {
      alert("Por favor, completa todos los campos correctamente. Debe haber al menos un producto válido.");
      return;
    }
    
    setSubmitting(true);
    try {
      const payload: PurchaseRequest = { branchId, supplierId, responsibleUser, details };
      await PurchaseService.create(payload);
      alert("¡Compra registrada exitosamente! El costo promedio (CPP) y el stock han sido actualizados.");
      onSuccess(); // Limpia y notifica al padre
    } catch (err) {
      alert("Ocurrió un error al registrar la compra.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Registrar Nueva Compra</h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Encabezado de la Compra */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Sucursal Receptora</label>
            <select value={branchId} onChange={e => setBranchId(Number(e.target.value))} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 outline-none">
              <option value={0}>Seleccione una sucursal...</option>
              {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Proveedor</label>
            <select value={supplierId} onChange={e => setSupplierId(Number(e.target.value))} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 outline-none">
              <option value={0}>Seleccione un proveedor...</option>
              {suppliers.map(s => <option key={s.id} value={s.id}>{s.companyName}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Usuario Responsable</label>
            <input type="text" placeholder="Ej. Juan Pérez" value={responsibleUser} onChange={e => setResponsibleUser(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
        </div>

        {/* Detalle Dinámico de Productos */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-800">Detalle de Productos</h3>
            <button type="button" onClick={addDetailRow} className="text-sm bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-4 py-2 rounded-lg font-semibold transition-colors">
              + Agregar Línea
            </button>
          </div>
          
          <div className="space-y-3">
            {details.map((detail, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-4 items-end bg-white p-4 rounded-xl border border-slate-200 shadow-sm animate-in slide-in-from-top-2 duration-300">
                <div className="flex-1 w-full">
                  <label className="block text-xs font-medium text-slate-500 mb-1">Producto</label>
                  <select value={detail.productId} onChange={e => updateDetail(index, 'productId', Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm">
                    <option value={0}>Seleccionar producto...</option>
                    {products.map(p => <option key={p.id} value={p.id}>[{p.sku}] {p.name}</option>)}
                  </select>
                </div>
                <div className="w-full md:w-32">
                  <label className="block text-xs font-medium text-slate-500 mb-1">Cantidad</label>
                  <input type="number" min="1" value={detail.quantity} onChange={e => updateDetail(index, 'quantity', Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
                </div>
                <div className="w-full md:w-32">
                  <label className="block text-xs font-medium text-slate-500 mb-1">Costo Unitario ($)</label>
                  <input type="number" min="0.01" step="0.01" value={detail.unitCost} onChange={e => updateDetail(index, 'unitCost', Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
                </div>
                <div className="w-full md:w-32 bg-slate-50 px-3 py-2 rounded-lg border border-transparent">
                  <label className="block text-xs font-medium text-slate-400 mb-1">Subtotal</label>
                  <div className="font-semibold text-slate-800">${(detail.quantity * detail.unitCost).toFixed(2)}</div>
                </div>
                <button type="button" onClick={() => removeDetail(index)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar línea">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            ))}
            {details.length === 0 && (
              <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-400 text-sm">
                Agrega productos a la compra usando el botón "+ Agregar Línea"
              </div>
            )}
          </div>
        </div>

        {/* Resumen Total y Submit */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-slate-100 gap-6">
          <div className="text-xl">
            <span className="text-slate-500 font-medium">Total Estimado: </span>
            <span className="text-3xl font-bold text-emerald-600">${totalAmount.toFixed(2)}</span>
          </div>
          <button type="submit" disabled={submitting || details.length === 0} className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3.5 rounded-xl font-semibold text-lg transition-all shadow-lg shadow-emerald-200">
            {submitting ? 'Registrando...' : 'Confirmar Compra'}
          </button>
        </div>
      </form>
    </div>
  );
};
