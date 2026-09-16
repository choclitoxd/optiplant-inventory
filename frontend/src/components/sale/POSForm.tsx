import { useState, useEffect, useMemo } from 'react';
import { MagnifyingGlass, ShoppingCart, Plus, Minus, Trash, Receipt, User, Storefront, CashRegister, Warning } from '@phosphor-icons/react';
import type { Branch, Inventory, Product } from '../../types';
import type { SaleDetailRequest } from '../../types/sale';
import { branchService, inventoryService } from '../../services/branchService';
import { productService } from '../../services/productService';
import { saleService } from '../../services/saleService';
import { Dropdown } from '../ui/Dropdown';

export const POSForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [inventories, setInventories] = useState<Inventory[]>([]);
  
  const [selectedBranch, setSelectedBranch] = useState<number>(0);
  const [responsibleUser, setResponsibleUser] = useState<string>('');
  const [cart, setCart] = useState<(SaleDetailRequest & { product: Product })[]>([]);
  const [search, setSearch] = useState('');
  
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

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 animate-in fade-in duration-300">
      
      {/* Catálogo de Productos (Izquierda - 65%) */}
      <div className="xl:col-span-8 bg-white/90 backdrop-blur-md rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 flex flex-col h-[75vh]">
        
        {/* Header Catálogo */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
              <Storefront size={24} weight="duotone" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 leading-tight">Terminal de Ventas</h2>
              <p className="text-sm text-slate-500 font-medium">Seleccione los productos para el ticket.</p>
            </div>
          </div>
          
          <div className="flex-1 w-full md:max-w-xs flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 transition-colors focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
            <MagnifyingGlass size={18} className="text-slate-400" weight="bold" />
            <input 
              type="text" 
              placeholder="Buscar producto o SKU..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-transparent border-none text-slate-700 text-sm font-medium p-2.5 outline-none placeholder:text-slate-400"
            />
          </div>
        </div>
        
        {/* Filtro Sucursal */}
        <div className="mb-6 flex items-center gap-3 p-3 bg-slate-50/50 rounded-2xl border border-slate-100">
          <label className="text-sm font-bold text-slate-600 uppercase tracking-wider pl-2">Sucursal Activa:</label>
          <Dropdown
            options={branches.map(b => ({ value: b.id as number, label: b.name }))}
            value={selectedBranch || ''}
            onChange={(val) => setSelectedBranch(Number(val))}
            placeholder="Seleccione sucursal"
            themeColor="#10b981"
            className="flex-1 max-w-[250px]"
          />
        </div>

        {/* Grid de Productos */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {filteredProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <MagnifyingGlass size={48} weight="duotone" className="text-slate-300 mb-3" />
              <p className="font-medium text-slate-500">No se encontraron productos.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
              {filteredProducts.map(p => {
                const stock = inventories.find(i => i.productId === p.id)?.stock || 0;
                const isOutOfStock = stock === 0;
                const cartQty = cart.find(c => c.productId === p.id)?.quantity || 0;
                
                return (
                  <div 
                    key={p.id} 
                    onClick={() => !isOutOfStock && addToCart(p)}
                    className={`relative flex flex-col justify-between p-4 rounded-2xl border transition-all cursor-pointer group
                      ${isOutOfStock 
                        ? 'bg-slate-50 border-slate-100 opacity-60 cursor-not-allowed' 
                        : 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-md hover:-translate-y-0.5'
                      }
                      ${cartQty > 0 ? 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/30' : ''}
                    `}
                  >
                    {cartQty > 0 && (
                      <div className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs font-black w-6 h-6 flex items-center justify-center rounded-full shadow-md z-10 border-2 border-white">
                        {cartQty}
                      </div>
                    )}
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md uppercase tracking-wider">{p.sku}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${isOutOfStock ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-600'}`}>
                          Stock: {stock}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-800 leading-snug pr-4">{p.name}</h3>
                    </div>
                    
                    <div className="flex justify-between items-end mt-4 pt-4 border-t border-slate-100/80">
                      <span className="text-lg font-black text-emerald-600">${p.basePrice.toFixed(2)}</span>
                      <button 
                        disabled={isOutOfStock}
                        className={`w-8 h-8 flex items-center justify-center rounded-xl transition-colors
                          ${isOutOfStock 
                            ? 'bg-slate-100 text-slate-400' 
                            : 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white'
                          }
                        `}
                      >
                        <Plus size={16} weight="bold" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Carrito POS / Ticket (Derecha - 35%) */}
      <div className="xl:col-span-4 bg-slate-900 rounded-3xl shadow-2xl p-6 flex flex-col h-[75vh] relative overflow-hidden text-white border border-slate-800">
        
        {/* Background Decorative */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

        <div className="relative z-10 flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
          <div className="p-2 bg-slate-800 rounded-lg text-emerald-400">
            <Receipt size={24} weight="duotone" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white leading-tight">Ticket de Venta</h2>
            <p className="text-xs text-slate-400 font-medium">Resumen de la operación</p>
          </div>
        </div>
        
        {errorMsg && (
          <div className="relative z-10 mb-4 bg-rose-500/10 border border-rose-500/30 text-rose-300 px-4 py-3 rounded-xl text-sm font-medium flex items-start gap-2">
            <Warning size={18} weight="fill" className="text-rose-400" /> {errorMsg}
          </div>
        )}

        {/* Input Cajero */}
        <div className="relative z-10 mb-4">
          <div className="flex items-center bg-slate-800/80 border border-slate-700 rounded-xl px-3 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all">
            <User size={18} className="text-slate-400" weight="bold" />
            <input 
              type="text" 
              placeholder="Cajero responsable..." 
              value={responsibleUser}
              onChange={e => setResponsibleUser(e.target.value)}
              className="w-full bg-transparent text-white placeholder:text-slate-500 p-3 outline-none text-sm font-medium"
            />
          </div>
        </div>

        {/* Lista de Ítems (Ticket) */}
        <div className="relative z-10 flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
          {cart.length === 0 ? (
             <div className="h-full flex flex-col items-center justify-center text-slate-500">
               <ShoppingCart size={48} weight="duotone" className="text-slate-700 mb-4 opacity-50" />
               <p className="font-medium text-slate-400">El carrito está vacío</p>
               <p className="text-xs text-slate-600 mt-1">Selecciona productos del catálogo</p>
             </div>
          ) : cart.map(item => (
            <div key={item.productId} className="group bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 p-3 rounded-2xl transition-colors">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-slate-200 text-sm pr-2 leading-snug">{item.product.name}</h4>
                <div className="text-right">
                  <span className="font-black text-emerald-400">${(item.product.basePrice * item.quantity).toFixed(2)}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-3">
                <span className="text-slate-400 text-xs font-medium">${item.product.basePrice.toFixed(2)} c/u</span>
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-700">
                    <button onClick={() => updateQuantity(item.productId, -1)} className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 rounded-md transition-colors"><Minus size={12} weight="bold" /></button>
                    <span className="w-8 text-center font-bold text-sm text-slate-200">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, 1)} className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 rounded-md transition-colors"><Plus size={12} weight="bold" /></button>
                  </div>
                  <button onClick={() => removeFromCart(item.productId)} className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-rose-400 bg-slate-900 hover:bg-rose-500/10 rounded-lg border border-slate-700 transition-colors ml-1">
                    <Trash size={14} weight="bold" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Ticket (Total y CTA) */}
        <div className="relative z-10 mt-4 pt-5 border-t border-slate-700/80 border-dashed">
          <div className="flex justify-between items-center mb-6">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-xs">Total a cobrar</span>
            <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 tracking-tight">
              ${total.toFixed(2)}
            </span>
          </div>
          
          <button 
            onClick={handleCheckout}
            disabled={loading || cart.length === 0}
            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-500 disabled:border-slate-700 disabled:border text-slate-900 py-4 rounded-2xl font-black text-lg transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.2)] disabled:shadow-none flex justify-center items-center gap-2"
          >
            {loading ? (
              <div className="animate-spin h-6 w-6 border-2 border-slate-900 border-t-transparent rounded-full"></div>
            ) : (
              <>
                <CashRegister size={24} weight="fill" />
                Finalizar Venta
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
