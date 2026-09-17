import { useEffect, useState } from 'react';
import type { Branch, Inventory, Product } from '../../types';
import { branchService, inventoryService } from '../../services/branchService';
import { productService } from '../../services/productService';
import { Dropdown } from '../ui/Dropdown';

export const BranchStockView = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    branchService.getAll().then(res => {
      const actives = res.filter(b => b.active);
      setBranches(actives);
      if(actives.length > 0) setSelectedBranch(actives[0].id);
    });
    productService.getAll().then(setProducts);
  }, []);

  useEffect(() => {
    if (selectedBranch > 0) {
      setLoading(true);
      inventoryService.getByBranch(selectedBranch).then(setInventories).finally(() => setLoading(false));
    }
  }, [selectedBranch]);

  const stockList = products.map(p => {
    const inv = inventories.find(i => i.productId === p.id);
    return { product: p, stock: inv?.stock || 0, threshold: inv?.minStockThreshold || 0 };
  });

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-semibold text-slate-800 tracking-tight">Control de Stock Local</h2>
        <div className="w-full md:w-64 z-40">
          <Dropdown
            options={branches.map(b => ({ value: b.id, label: b.name }))}
            value={selectedBranch}
            onChange={(v) => setSelectedBranch(Number(v))}
            placeholder={branches.length === 0 ? "Sin sucursales..." : "Selecciona una sucursal"}
            themeColor="#4f46e5" // indigo-600
          />
        </div>
      </div>

      {loading ? (
        <div className="h-40 flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full"></div></div>
      ) : branches.length === 0 ? (
        <div className="text-center py-10 text-slate-400">Por favor, registra y activa una sucursal primero.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-sm font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-4 px-4">SKU / Producto</th>
                <th className="py-4 px-4 text-center">Stock Actual</th>
                <th className="py-4 px-4 text-center">Mínimo Requerido</th>
                <th className="py-4 px-4 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stockList.map(item => {
                const isCritico = item.stock === 0;
                const isBajo = item.stock <= item.threshold && item.stock > 0;
                
                return (
                  <tr key={item.product.id} className="hover:bg-slate-50/50 transition-colors duration-200">
                    <td className="py-4 px-4">
                      <p className="text-slate-800 font-medium">{item.product.name}</p>
                      <p className="text-xs text-slate-400">{item.product.sku}</p>
                    </td>
                    <td className="py-4 px-4 text-center text-lg font-bold text-slate-700">{item.stock}</td>
                    <td className="py-4 px-4 text-center text-slate-500">{item.threshold}</td>
                    <td className="py-4 px-4 text-center">
                      {isCritico ? (
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-rose-100 text-rose-700 border border-rose-200">Agotado</span>
                      ) : isBajo ? (
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-700 border border-amber-200">Bajo Stock</span>
                      ) : (
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">Óptimo</span>
                      )}
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
