import { useState, useEffect, useMemo } from 'react';
import { purchaseService } from '../../services/purchaseService';
import type { Supplier } from '../../types/supplier';
import type { PurchaseDetailRequest } from '../../types/purchase';
import { Dropdown } from '../ui/Dropdown';

import { branchService } from '../../services/branchService';
import { productService } from '../../services/productService';
import type { Branch, Product } from '../../types';

export const PurchaseForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [branchId, setBranchId] = useState<number>(0);
  const [supplierId, setSupplierId] = useState<number>(0);
  const [responsibleUser, setResponsibleUser] = useState('');
  const [details, setDetails] = useState<PurchaseDetailRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    purchaseService.getSuppliers().then(setSuppliers).catch(() => setError('Error cargando proveedores. Asegúrate de tener proveedores creados.'));
    branchService.getAll().then(res => setBranches(res.filter(b => b.active)));
    productService.getAll().then(setProducts);
  }, []);

  const totalAmount = useMemo(() => details.reduce((acc, item) => acc + (item.quantity * item.unitCost), 0), [details]);

  const addLine = () => setDetails([...details, { productId: 0, quantity: 1, unitCost: 0 }]);
  const removeLine = (idx: number) => setDetails(details.filter((_, i) => i !== idx));
  const updateLine = (idx: number, field: keyof PurchaseDetailRequest, val: number) => {
    setDetails(prev => {
      const newDetails = [...prev];
      newDetails[idx] = { ...newDetails[idx], [field]: val };
      return newDetails;
    });
  };

  const selectProduct = (idx: number, productId: number) => {
    const prod = products.find(p => p.id === productId);
    if (!prod) return;
    setDetails(prev => {
      const newDetails = [...prev];
      newDetails[idx] = { ...newDetails[idx], productId, unitCost: prod.basePrice };
      return newDetails;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierId || details.length === 0 || details.some(d => !d.productId)) {
      setError('Complete todos los campos y agregue al menos un producto con ID válido.');
      return;
    }
    setLoading(true);
    try {
      await purchaseService.registerPurchase({ branchId, supplierId, responsibleUser, details });
      setDetails([]);
      setSupplierId(0);
      setResponsibleUser('');
      setError('');
      if (onSuccess) onSuccess();
    } catch (err) {
      setError('Hubo un error al registrar la compra. Verifica que el producto exista.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
      <h3 className="text-xl font-semibold text-slate-800 mb-6 tracking-tight">Registrar Entrada de Inventario</h3>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md border border-red-200 flex items-center text-sm">
          <span className="font-medium">{error}</span>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Proveedor</label>
          <div className="z-50 relative">
            <Dropdown 
              options={suppliers.map(s => ({ value: s.id as number, label: s.companyName }))}
              value={supplierId || ''}
              onChange={(val) => setSupplierId(Number(val))}
              placeholder="Seleccione un proveedor"
              themeColor="#2563eb" 
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Sucursal Destino</label>
          <div className="z-40 relative">
            <Dropdown 
              options={branches.map(b => ({ value: b.id, label: b.name }))}
              value={branchId || ''}
              onChange={(val) => setBranchId(Number(val))}
              placeholder="Seleccione una sucursal"
              themeColor="#2563eb" 
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Usuario Responsable</label>
          <input required className="w-full border border-slate-300 rounded-md p-[11px] focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-slate-50 focus:bg-white transition-colors" placeholder="Ej. Juan Pérez" value={responsibleUser} onChange={e => setResponsibleUser(e.target.value)} />
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4 border-b pb-3 border-slate-100">
          <h4 className="text-sm uppercase tracking-wider font-semibold text-slate-600">Detalle de Productos</h4>
          <button type="button" onClick={addLine} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 px-3 rounded-md transition-colors flex items-center gap-1">
            <span className="text-lg leading-none">+</span> Añadir Línea
          </button>
        </div>
        
        {details.length === 0 ? (
          <div className="text-slate-400 italic text-center py-8 bg-slate-50/50 rounded-md border border-dashed border-slate-200 text-sm">
            Haga clic en "Añadir Línea" para registrar los productos recibidos.
          </div>
        ) : (
          <div className="space-y-2">
            {details.map((item, idx) => (
              <div key={idx} className="flex gap-3 items-center bg-white p-2 rounded-md border border-slate-200 hover:border-slate-300 transition-colors shadow-sm overflow-visible">
                <div className="flex-1 min-w-[200px] z-30">
                  <Dropdown 
                    options={products.map(p => ({ value: p.id as number, label: `${p.sku} - ${p.name}` }))}
                    value={item.productId || ''}
                    onChange={(val) => selectProduct(idx, Number(val))}
                    placeholder="Seleccione Producto"
                    themeColor="#2563eb"
                  />
                </div>
                <input type="number" required min={1} placeholder="Cant." className="w-24 border-0 bg-slate-50 focus:bg-white rounded px-3 py-[10px] text-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={item.quantity || ''} onChange={e => updateLine(idx, 'quantity', Number(e.target.value))} />
                <input type="number" required min={0.01} step="0.01" placeholder="Costo Unit." className="w-32 border-0 bg-slate-50 focus:bg-white rounded px-3 py-[10px] text-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={item.unitCost || ''} onChange={e => updateLine(idx, 'unitCost', Number(e.target.value))} />
                <div className="w-28 text-right font-medium text-emerald-600 text-sm bg-emerald-50 py-2 rounded">
                  ${(item.quantity * item.unitCost).toLocaleString(undefined, {minimumFractionDigits: 2})}
                </div>
                <button type="button" onClick={() => removeLine(idx)} className="text-slate-400 hover:text-red-500 hover:bg-red-50 h-9 w-9 rounded-md transition-colors flex items-center justify-center">✕</button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-center pt-5 border-t border-slate-200 bg-slate-50 -mx-6 -mb-6 p-6 rounded-b-lg">
        <div className="flex flex-col">
          <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Total a Pagar</span>
          <span className="text-2xl text-slate-900 font-bold">${totalAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
        </div>
        <button type="submit" disabled={loading || details.length === 0} className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium py-2.5 px-6 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm">
          {loading ? 'Registrando...' : 'Confirmar Compra'}
        </button>
      </div>
    </form>
  );
};
