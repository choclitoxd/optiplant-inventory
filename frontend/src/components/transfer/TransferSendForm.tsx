import { useState, useEffect } from 'react';
import { Truck, ArrowRight, Package, User, Plus, Minus, Trash, Buildings, MagnifyingGlass, Warning } from '@phosphor-icons/react';
import type { Branch, Inventory, Product } from '../../types';
import type { TransferDetailRequest } from '../../types/transfer';
import { branchService, inventoryService } from '../../services/branchService';
import { productService } from '../../services/productService';
import { transferService } from '../../services/transferService';
import { Dropdown } from '../ui/Dropdown';

export const TransferSendForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [inventories, setInventories] = useState<Inventory[]>([]);
  
  const [originBranchId, setOriginBranchId] = useState<number>(0);
  const [destBranchId, setDestBranchId] = useState<number>(0);
  const [responsibleUser, setResponsibleUser] = useState<string>('');
  const [search, setSearch] = useState('');
  
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

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 animate-in fade-in duration-300 h-[75vh] min-h-[600px]">
      
      {/* Columna Izquierda (Ruta e Inventario) */}
      <div className="xl:col-span-8 flex flex-col gap-6 h-full">
        {/* Módulo de Ruta (Flujo Visual) */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 xl:p-8 shrink-0 relative z-10">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Ruta de Despacho</h2>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Origen */}
          <div className="w-full md:flex-1 bg-slate-50 border border-slate-200 rounded-2xl p-5 relative group focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400 transition-all">
            <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl bg-slate-300 group-focus-within:bg-blue-400 transition-colors"></div>
            <div className="flex items-center gap-3 mb-2">
              <Buildings size={20} className="text-slate-500" weight="duotone" />
              <label className="text-sm font-bold text-slate-600">Sucursal Origen</label>
            </div>
            <Dropdown
              options={branches.map(b => ({ value: b.id as number, label: b.name }))}
              value={originBranchId || ''}
              onChange={(val) => setOriginBranchId(Number(val))}
              placeholder="Origen"
              themeColor="#3b82f6"
              className="w-full font-bold text-lg"
            />
          </div>

          {/* Flecha Flujo */}
          <div className="hidden md:flex flex-col items-center text-blue-500 px-4">
            <Truck size={32} weight="duotone" className="mb-1 animate-pulse" />
            <ArrowRight size={24} weight="bold" />
          </div>
          <div className="md:hidden flex justify-center text-blue-500 py-2">
            <ArrowRight size={24} weight="bold" className="rotate-90" />
          </div>

          {/* Destino */}
          <div className="w-full md:flex-1 bg-blue-50/50 border border-blue-100 rounded-2xl p-5 relative group focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
            <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl bg-blue-300 group-focus-within:bg-blue-500 transition-colors"></div>
            <div className="flex items-center gap-3 mb-2">
              <Buildings size={20} className="text-blue-600" weight="duotone" />
              <label className="text-sm font-bold text-blue-800">Sucursal Destino</label>
            </div>
            <Dropdown
              options={branches.map(b => ({ value: b.id as number, label: b.name }))}
              value={destBranchId || ''}
              onChange={(val) => setDestBranchId(Number(val))}
              placeholder="Destino"
              themeColor="#2563eb"
              className="w-full font-bold text-lg"
            />
          </div>
        </div>
        
        {errorMsg && (
          <div className="mt-6 bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2">
            <Warning size={18} weight="fill" className="text-rose-500" /> {errorMsg}
          </div>
        )}
      </div>

      {/* Catálogo de Inventario */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 flex flex-col flex-1 min-h-0">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Inventario Disponible</h2>
              <p className="text-sm text-slate-500 font-medium">Seleccione productos para transferir.</p>
            </div>
            
            <div className="w-full md:w-64 flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
              <MagnifyingGlass size={18} className="text-slate-400" weight="bold" />
              <input 
                type="text" 
                placeholder="Buscar producto..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-transparent border-none text-slate-700 text-sm font-medium p-2.5 outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
            {filteredProducts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <Package size={48} weight="duotone" className="text-slate-300 mb-3" />
                <p className="font-medium text-slate-500">No se encontraron productos.</p>
              </div>
            ) : (
              filteredProducts.map(p => {
                const stock = inventories.find(i => i.productId === p.id)?.stock || 0;
                const isOutOfStock = stock === 0;
                const cartQty = cart.find(c => c.productId === p.id)?.quantitySent || 0;
                
                return (
                  <div key={p.id} className={`flex justify-between items-center p-4 rounded-2xl border transition-all
                    ${isOutOfStock ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-sm'}
                    ${cartQty > 0 ? 'ring-2 ring-blue-500 border-blue-500 bg-blue-50/30' : ''}
                  `}>
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${isOutOfStock ? 'bg-slate-200 text-slate-400' : 'bg-blue-100 text-blue-600'}`}>
                        <Package size={20} weight={cartQty > 0 ? "fill" : "duotone"} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md uppercase tracking-wider">{p.sku}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${isOutOfStock ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-600'}`}>
                            Stock local: {stock}
                          </span>
                        </div>
                        <h3 className="font-bold text-slate-800 text-sm md:text-base">{p.name}</h3>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => !isOutOfStock && addToCart(p)}
                      disabled={isOutOfStock}
                      className={`h-10 w-10 flex items-center justify-center rounded-xl transition-all
                        ${isOutOfStock 
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                          : 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white shadow-sm'
                        }
                      `}
                    >
                      <Plus size={16} weight="bold" />
                    </button>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* Cargamento a Enviar (Derecha - 35%) */}
      <div className="xl:col-span-4 bg-slate-900 rounded-3xl shadow-2xl p-6 flex flex-col h-full text-white relative overflow-hidden border border-slate-800">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

          <div className="relative z-10 flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
            <div className="p-2 bg-slate-800 rounded-lg text-blue-400">
              <Truck size={24} weight="duotone" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white leading-tight">Cargamento</h2>
              <p className="text-xs text-slate-400 font-medium">Orden de despacho</p>
            </div>
          </div>

          <div className="relative z-10 mb-4">
            <div className="flex items-center bg-slate-800/80 border border-slate-700 rounded-xl px-3 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
              <User size={18} className="text-slate-400" weight="bold" />
              <input 
                type="text" 
                placeholder="Responsable del envío..." 
                value={responsibleUser}
                onChange={e => setResponsibleUser(e.target.value)}
                className="w-full bg-transparent text-white placeholder:text-slate-500 p-3 outline-none text-sm font-medium"
              />
            </div>
          </div>

          <div className="relative z-10 flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {cart.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center text-slate-500">
                 <Package size={48} weight="duotone" className="text-slate-700 mb-4 opacity-50" />
                 <p className="font-medium text-slate-400">Sin productos</p>
                 <p className="text-xs text-slate-600 mt-1">Agrega unidades para transferir</p>
               </div>
            ) : cart.map(item => (
              <div key={item.productId} className="bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 p-3 rounded-2xl transition-colors flex justify-between items-center">
                <div className="flex-1 pr-3">
                  <h4 className="font-bold text-slate-200 text-sm leading-snug truncate">{item.product.name}</h4>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-700">
                    <button onClick={() => updateQuantity(item.productId, -1)} className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 rounded-md transition-colors"><Minus size={12} weight="bold" /></button>
                    <span className="w-8 text-center font-bold text-sm text-blue-400">{item.quantitySent}</span>
                    <button onClick={() => updateQuantity(item.productId, 1)} className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 rounded-md transition-colors"><Plus size={12} weight="bold" /></button>
                  </div>
                  <button onClick={() => setCart(prev => prev.filter(c => c.productId !== item.productId))} className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-rose-400 bg-slate-900 hover:bg-rose-500/10 rounded-lg border border-slate-700 transition-colors ml-1">
                    <Trash size={14} weight="bold" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="relative z-10 mt-4 pt-5 border-t border-slate-700/80 border-dashed">
            <div className="flex justify-between items-center mb-6">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-xs">Total Unidades</span>
              <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 tracking-tight">
                {cart.reduce((sum, item) => sum + item.quantitySent, 0)}
              </span>
            </div>
            
            <button 
              onClick={handleSend}
              disabled={loading || cart.length === 0}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:border-slate-700 disabled:border text-white py-4 rounded-2xl font-black text-lg transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.2)] disabled:shadow-none flex justify-center items-center gap-2"
            >
              {loading ? (
                <div className="animate-spin h-6 w-6 border-2 border-slate-900 border-t-transparent rounded-full"></div>
              ) : (
                <>
                  Emitir Despacho
                  <ArrowRight size={20} weight="bold" />
                </>
              )}
            </button>
          </div>
        </div>
    </div>
  );
};
