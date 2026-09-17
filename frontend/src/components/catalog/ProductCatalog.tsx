import { useEffect, useState } from 'react';
import type { Product, ProductRequest } from '../../types';
import { productService } from '../../services/productService';
import { MagnifyingGlass, Plus } from '@phosphor-icons/react';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../types/auth';

export const ProductCatalog = () => {
  const { user } = useAuth();
  const isAdmin = user?.roles?.includes(Role.ADMIN);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<ProductRequest>({ sku: '', name: '', description: '', unitOfMeasure: '', basePrice: 0 });

  const loadProducts = () => {
    setLoading(true);
    productService.getAll().then(setProducts).finally(() => setLoading(false));
  };

  useEffect(() => { loadProducts(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await productService.create(formData);
      setIsModalOpen(false);
      loadProducts();
    } catch (err) {
      alert("Error al guardar el producto.");
    }
  };

  const filtered = products.filter(p => 
    p.sku.toLowerCase().includes(search.toLowerCase()) || 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200 p-6 transition-all duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-semibold text-slate-800 tracking-tight">Catálogo Global</h2>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <MagnifyingGlass size={16} weight="bold" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar por SKU o Nombre..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
            />
          </div>
          {isAdmin && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="whitespace-nowrap flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all duration-300 shadow-sm shadow-indigo-200"
            >
              <Plus size={16} weight="bold" /> Nuevo Producto
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="h-40 flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full"></div></div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-sm font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-4 px-4">SKU</th>
                <th className="py-4 px-4">Producto</th>
                <th className="py-4 px-4 text-right">Precio Base</th>
                <th className="py-4 px-4 text-right">Costo Promedio (CPP)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                 <tr><td colSpan={4} className="text-center py-10 text-slate-400">No se encontraron productos.</td></tr>
              ) : filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors duration-200 group">
                  <td className="py-4 px-4 font-medium text-slate-700">{p.sku}</td>
                  <td className="py-4 px-4">
                    <p className="text-slate-800 font-medium">{p.name}</p>
                    <p className="text-xs text-slate-400">{p.description} ({p.unitOfMeasure})</p>
                  </td>
                  <td className="py-4 px-4 text-right font-medium text-emerald-600">${p.basePrice.toFixed(2)}</td>
                  <td className="py-4 px-4 text-right text-slate-500">${p.weightedAverageCost.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-semibold mb-4 text-slate-800">Agregar Producto</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">SKU</label>
                <input required type="text" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Unidad Medida</label>
                  <input required type="text" value={formData.unitOfMeasure} onChange={e => setFormData({...formData, unitOfMeasure: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="Ej: PZA, KG" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Precio Base</label>
                  <input required type="number" step="0.01" value={formData.basePrice} onChange={e => setFormData({...formData, basePrice: parseFloat(e.target.value)})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors font-medium">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
