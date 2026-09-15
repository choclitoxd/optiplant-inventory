import { useState, useEffect } from 'react';
import type { Branch, Inventory, Product } from '../../types';
import type { TransferDetailRequest } from '../../types/transfer';
import { branchService, inventoryService } from '../../services/branchService';
import { productService } from '../../services/productService';
import { transferService } from '../../services/transferService';

export const TransferSendForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [inventories, setInventories] = useState<Inventory[]>([]);
  
  const [originBranchId, setOriginBranchId] = useState<number>(0);
  const [destBranchId, setDestBranchId] = useState<number>(0);
  const [responsibleUser, setResponsibleUser] = useState<string>('');
  
  const [cart, setCart] = useState<(TransferDetailRequest & { product: Product })[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    branchService.getAll().then(res => {
      const actives = res.filter(b => b.active);
      setBranches(actives);
      if(actives.length > 0) {
        setOriginBranchId(actives[0].id);
        if(actives.length > 1) setDestBranchId(actives[1].id);
      }
    });
    productService.getAll().then(setProducts);
  }, []);

  useEffect(() => {
    if (originBranchId > 0) {
      setLoading(true);
      inventoryService.getByBranch(originBranchId).then(setInventories).finally(() => setLoading(false));
      setCart([]);
    }
  }, [originBranchId]);

  const addToCart = (product: Product) => {
    const stock = inventories.find(i => i.productId === product.id)?.stock || 0;
    if (stock <= 0) return;

    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        if (existing.quantitySent >= stock) return prev;
        return prev.map(item => item.productId === product.id ? { ...item, quantitySent: item.quantitySent + 1 } : item);
      }
      return [...prev, { productId: product.id, quantitySent: 1, product }];
    });
  };

  const updateQuantity = (productId: number, delta: number) => {
    const stock = inventories.find(i => i.productId === productId)?.stock || 0;
    setCart(prev => prev.map(item => {
      if (item.productId === productId) {
        const newQ = item.quantitySent + delta;
        if (newQ > 0 && newQ <= stock) return { ...item, quantitySent: newQ };
      }
      return item;
    }));
  };

  const handleSend = async () => {
    if (originBranchId === destBranchId) {
      setErrorMsg("La sucursal de origen y destino no pueden ser la misma.");
      return;
    }
    if (cart.length === 0 || !responsibleUser.trim()) {
      setErrorMsg("Debe ingresar un usuario y agregar al menos un producto.");
      return;
    }
    
    setLoading(true);
    setErrorMsg(null);
    try {
      await transferService.sendTransfer({
        originBranchId,
        destinationBranchId: destBranchId,
        responsibleUser,
        details: cart.map(c => ({ productId: c.productId, quantitySent: c.quantitySent }))
      });
      setCart([]);
      setResponsibleUser('');
      const invs = await inventoryService.getByBranch(originBranchId);
      setInventories(invs);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || "Error al procesar el envío.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col h-[70vh]">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Stock Origen (Despacho)</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Origen</label>
            <select value={originBranchId} onChange={e => setOriginBranchId(Number(e.target.value))} className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl p-2 outline-none focus:ring-2 focus:ring-blue-500">
              {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Destino</label>
            <select value={destBranchId} onChange={e => setDestBranchId(Number(e.target.value))} className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl p-2 outline-none focus:ring-2 focus:ring-blue-500">
              {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
          {products.map(p => {
            const stock = inventories.find(i => i.productId === p.id)?.stock || 0;
            const isOutOfStock = stock === 0;
            return (
              <div key={p.id} className="flex justify-between items-center p-3 rounded-xl border bg-white border-slate-200">
                <div>
                  <h3 className="font-semibold text-slate-800">{p.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isOutOfStock ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'}`}>Stock: {stock}</span>
                </div>
                <button onClick={() => addToCart(p)} disabled={isOutOfStock} className="h-8 w-8 rounded bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white disabled:bg-slate-100 disabled:text-slate-400">+</button>
              </div>
            )
          })}
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl shadow-xl p-6 flex flex-col h-[70vh] text-white">
        <h2 className="text-xl font-bold mb-4 text-white">Orden de Envío</h2>
        
        {errorMsg && <div className="mb-4 bg-rose-500/20 text-rose-200 p-3 rounded-xl text-sm border border-rose-500/50">⚠️ {errorMsg}</div>}

        <input 
          type="text" 
          placeholder="Usuario responsable (Quien despacha)..." 
          value={responsibleUser}
          onChange={e => setResponsibleUser(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-3 mb-4 outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
          {cart.map(item => (
            <div key={item.productId} className="flex justify-between items-center bg-slate-800 p-3 rounded-xl">
              <span className="font-medium text-slate-200">{item.product.name}</span>
              <div className="flex items-center gap-2">
                <button onClick={() => updateQuantity(item.productId, -1)} className="px-2 hover:text-rose-400">-</button>
                <span className="w-6 text-center font-bold">{item.quantitySent}</span>
                <button onClick={() => updateQuantity(item.productId, 1)} className="px-2 hover:text-blue-400">+</button>
                <button onClick={() => setCart(prev => prev.filter(c => c.productId !== item.productId))} className="text-slate-500 ml-2 hover:text-rose-500">✕</button>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={handleSend}
          disabled={loading || cart.length === 0}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 text-white py-4 rounded-xl font-bold transition-all flex justify-center items-center"
        >
          {loading ? 'Procesando...' : 'Emitir Despacho'}
        </button>
      </div>
    </div>
  );
};
