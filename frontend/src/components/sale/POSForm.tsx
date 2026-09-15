import { useState, useEffect, useMemo } from 'react';
import type { Branch, Inventory, Product } from '../../types';
import type { SaleDetailRequest } from '../../types/sale';
import { branchService, inventoryService } from '../../services/branchService';
import { productService } from '../../services/productService';
import { saleService } from '../../services/saleService';

export const POSForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [inventories, setInventories] = useState<Inventory[]>([]);
  
  const [selectedBranch, setSelectedBranch] = useState<number>(0);
  const [responsibleUser, setResponsibleUser] = useState<string>('');
  const [cart, setCart] = useState<(SaleDetailRequest & { product: Product })[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
      setCart([]); // Reset cart on branch change
    }
  }, [selectedBranch]);

  const addToCart = (product: Product) => {
    const stock = inventories.find(i => i.productId === product.id)?.stock || 0;
    if (stock <= 0) return;

    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        if (existing.quantity >= stock) return prev; // Prevenir sobreventa
        return prev.map(item => item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { productId: product.id, quantity: 1, product }];
    });
  };

  const updateQuantity = (productId: number, delta: number) => {
    const stock = inventories.find(i => i.productId === productId)?.stock || 0;
    setCart(prev => prev.map(item => {
      if (item.productId === productId) {
        const newQ = item.quantity + delta;
        if (newQ > 0 && newQ <= stock) return { ...item, quantity: newQ };
      }
      return item;
    }));
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const total = useMemo(() => cart.reduce((sum, item) => sum + (item.product.basePrice * item.quantity), 0), [cart]);

  const handleCheckout = async () => {
    if (cart.length === 0 || !responsibleUser.trim()) {
      setErrorMsg("Debe ingresar un usuario y agregar al menos un producto.");
      return;
    }
    
    setLoading(true);
    setErrorMsg(null);
    try {
      await saleService.processSale({
        branchId: selectedBranch,
        responsibleUser,
        details: cart.map(c => ({ productId: c.productId, quantity: c.quantity }))
      });
      setCart([]);
      setResponsibleUser('');
      // Refresh inventory
      const invs = await inventoryService.getByBranch(selectedBranch);
      setInventories(invs);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      // Handle HTTP 400/409 Insufficient Stock Error
      setErrorMsg(err.response?.data?.error || "Error al procesar la venta. Intente de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-300">
      
      {/* Catálogo de Productos y Selección */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col h-[70vh]">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Productos Disponibles</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-1">Sucursal de Venta</label>
          <select 
            value={selectedBranch} 
            onChange={e => setSelectedBranch(Number(e.target.value))}
            className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-indigo-500 font-medium transition-all"
          >
            {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
          {products.map(p => {
            const stock = inventories.find(i => i.productId === p.id)?.stock || 0;
            const isOutOfStock = stock === 0;
            
            return (
              <div key={p.id} className={`flex justify-between items-center p-4 rounded-xl border transition-all ${isOutOfStock ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-sm'}`}>
                <div>
                  <h3 className="font-semibold text-slate-800">{p.name} <span className="text-xs text-slate-400">({p.sku})</span></h3>
                  <div className="flex gap-3 mt-1 items-center">
                    <span className="text-emerald-600 font-bold">${p.basePrice.toFixed(2)}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isOutOfStock ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'}`}>
                      Stock: {stock}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => addToCart(p)}
                  disabled={isOutOfStock}
                  className="h-10 w-10 flex items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white disabled:bg-slate-100 disabled:text-slate-400 transition-colors"
                >
                  +
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Carrito POS */}
      <div className="bg-slate-900 rounded-2xl shadow-xl p-6 flex flex-col h-[70vh] text-white">
        <h2 className="text-xl font-bold text-white mb-4">Ticket de Venta</h2>
        
        {errorMsg && (
          <div className="mb-4 bg-rose-500/20 border border-rose-500/50 text-rose-200 px-4 py-3 rounded-xl text-sm font-medium animate-in slide-in-from-top-2">
            ⚠️ {errorMsg}
          </div>
        )}

        <div className="mb-4">
          <input 
            type="text" 
            placeholder="Cajero responsable..." 
            value={responsibleUser}
            onChange={e => setResponsibleUser(e.target.value)}
            className="w-full bg-slate-800/50 border border-slate-700 text-white placeholder:text-slate-400 rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
          {cart.length === 0 ? (
             <div className="h-full flex flex-col items-center justify-center text-slate-500">
               <span className="text-4xl mb-2">🛒</span>
               <p>Carrito vacío</p>
             </div>
          ) : cart.map(item => (
            <div key={item.productId} className="flex justify-between items-center bg-slate-800 p-3 rounded-xl">
              <div className="flex-1">
                <h4 className="font-medium text-slate-200 truncate pr-2">{item.product.name}</h4>
                <span className="text-emerald-400 text-sm">${item.product.basePrice.toFixed(2)} c/u</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-slate-700 rounded-lg">
                  <button onClick={() => updateQuantity(item.productId, -1)} className="px-3 py-1 hover:text-rose-400">-</button>
                  <span className="w-6 text-center font-bold text-sm">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.productId, 1)} className="px-3 py-1 hover:text-emerald-400">+</button>
                </div>
                <div className="w-20 text-right font-bold text-emerald-400">
                  ${(item.product.basePrice * item.quantity).toFixed(2)}
                </div>
                <button onClick={() => removeFromCart(item.productId)} className="text-slate-500 hover:text-rose-500 ml-1">✕</button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-700">
          <div className="flex justify-between items-end mb-4">
            <span className="text-slate-400 font-medium text-lg">Total a cobrar:</span>
            <span className="text-4xl font-black text-emerald-400 tracking-tight">${total.toFixed(2)}</span>
          </div>
          
          <button 
            onClick={handleCheckout}
            disabled={loading || cart.length === 0}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-700 disabled:text-slate-500 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:shadow-none flex justify-center items-center gap-2"
          >
            {loading ? <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div> : 'Procesar Venta'}
          </button>
        </div>
      </div>
    </div>
  );
};
