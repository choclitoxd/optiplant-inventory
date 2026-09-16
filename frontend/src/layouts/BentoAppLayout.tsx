import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  SquaresFour, 
  WarningCircle, 
  Package, 
  DownloadSimple, 
  Receipt, 
  Truck,
  MagnifyingGlass,
  Bell,
  CaretLeft,
  CaretRight,
  Storefront
} from '@phosphor-icons/react';
import { branchService } from '../services/branchService';
import { productService } from '../services/productService';
import { alertService } from '../services/alertService';
import type { Branch, Product } from '../types';
import type { StockAlert } from '../types/stockAlert';

interface BentoAppLayoutProps {
  children: React.ReactNode;
}

export const BentoAppLayout: React.FC<BentoAppLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const [branches, setBranches] = useState<Branch[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Cargar catálogos y alertas globales para la cabecera
    Promise.all([branchService.getAll(), productService.getAll(), alertService.getLowStockAlerts()])
      .then(([bRes, pRes, aRes]) => {
        setBranches(bRes);
        setProducts(pRes);
        setAlerts(aRes);
      })
      .catch(console.error);
  }, []);

  // Manejador de tecla ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchQuery('');
        setIsSearching(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredBranches = branches.filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase()));
  const hasResults = filteredBranches.length > 0 || filteredProducts.length > 0;

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: SquaresFour },
    { name: 'Alertas Stock', path: '/alerts', icon: WarningCircle },
    { name: 'Catálogo y Stock', path: '/catalog', icon: Package },
    { name: 'Recepción (Compras)', path: '/purchases', icon: DownloadSimple },
    { name: 'Punto de Venta (POS)', path: '/sales', icon: Receipt },
    { name: 'Logística (Transferencias)', path: '/transfers', icon: Truck },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-indigo-200/50 flex">
      
      {/* Sidebar Colapsable (Oscura) */}
      <aside 
        className={`bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-all duration-300 ease-in-out relative z-20 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Toggle Button */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-3 top-8 w-6 h-6 bg-slate-800 text-slate-400 hover:text-white rounded-full flex items-center justify-center border border-slate-700 shadow-md transition-colors z-30"
          aria-label={isSidebarOpen ? 'Colapsar menú' : 'Expandir menú'}
        >
          {isSidebarOpen ? (
            <CaretLeft weight="bold" size={12} />
          ) : (
            <CaretRight weight="bold" size={12} />
          )}
        </button>

        <div className="w-full flex flex-col items-center justify-start py-6 h-full">
          
          {/* Logo */}
          <div className={`flex items-center gap-3 px-4 mb-8 h-10 w-full ${isSidebarOpen ? 'justify-start' : 'justify-center'}`}>
            <div className="w-10 h-10 min-w-[40px] bg-indigo-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <SquaresFour weight="fill" size={24} />
            </div>
            {isSidebarOpen && (
              <div className="overflow-hidden whitespace-nowrap opacity-100 transition-opacity duration-300 delay-100">
                <h1 className="text-lg font-black tracking-tight text-white leading-tight">OptiPlant</h1>
                <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Inventory System</p>
              </div>
            )}
          </div>
          
          {/* Navegación */}
          <nav className="flex flex-col w-full px-3 gap-2 overflow-y-auto overflow-x-hidden custom-scrollbar">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => 
                    `group relative flex items-center p-3 rounded-xl text-[13px] font-bold transition-all duration-200 ${
                      isActive 
                        ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' 
                        : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200 border border-transparent'
                    } ${isSidebarOpen ? 'justify-between' : 'justify-center'}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center">
                          <Icon size={22} weight={isActive ? "fill" : "duotone"} />
                        </span>
                        {isSidebarOpen && (
                          <span className="whitespace-nowrap">{item.name}</span>
                        )}
                      </div>
                      
                      {/* Tooltip visible solo en colapsado */}
                      {!isSidebarOpen && (
                        <div className="absolute left-full ml-3 px-3 py-2 bg-slate-800 text-white text-[12px] font-bold rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-xl border border-slate-700 flex items-center gap-2">
                          {item.name}
                        </div>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 flex flex-col min-w-0 transition-all duration-300 relative">
        <div className="p-6 md:p-8 flex-1 flex flex-col w-full h-full">
          {/* Searchbar Superior (Global) */}
          <div className="w-full flex items-center justify-between gap-4 mb-8 bg-white p-3 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100 relative z-30">
            <div className="flex-1 flex items-center gap-3 px-3 text-slate-400 relative">
              <MagnifyingGlass size={20} weight="bold" />
              <input 
                type="text" 
                placeholder="Buscar productos, sucursales (ej. Poblado), o presiona ESC para limpiar..." 
                className="w-full bg-transparent outline-none text-slate-700 font-medium placeholder:text-slate-400 text-sm"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value.length > 0) setIsSearching(true);
                  // Simular tiempo de carga muy corto
                  setTimeout(() => setIsSearching(false), 300);
                }}
              />
              
              {isSearching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="animate-spin w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full"></div>
                </div>
              )}

              {/* Menú Desplegable de Resultados (Spotlight Style) */}
              {searchQuery.trim().length > 0 && !isSearching && (
                <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden z-50 animate-in slide-in-from-top-2 fade-in duration-200">
                  <div className="max-h-80 overflow-y-auto custom-scrollbar p-2">
                    
                    {!hasResults ? (
                      <div className="p-4 text-center text-slate-400 text-sm font-medium">
                        No se encontraron resultados para "{searchQuery}"
                      </div>
                    ) : (
                      <>
                        {/* Sucursales */}
                        {filteredBranches.length > 0 && (
                          <div className="mb-2">
                            <div className="px-3 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                              Sucursales ({filteredBranches.length})
                            </div>
                            {filteredBranches.map(branch => (
                              <div 
                                key={`b-${branch.id}`} 
                                onClick={() => {
                                  setSearchQuery('');
                                  navigate('/dashboard');
                                }}
                                className="p-2 hover:bg-indigo-50 rounded-xl transition-colors cursor-pointer flex items-center gap-3 group"
                              >
                                <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-indigo-100 flex items-center justify-center text-slate-500 group-hover:text-indigo-600 transition-colors">
                                  <Storefront size={16} weight="bold" />
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-bold text-slate-700 group-hover:text-indigo-700 transition-colors">{branch.name}</p>
                                  <p className="text-xs text-slate-400 truncate">{branch.address}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Productos */}
                        {filteredProducts.length > 0 && (
                          <div>
                            <div className="px-3 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                              Productos ({filteredProducts.length})
                            </div>
                            {filteredProducts.map(product => (
                              <div 
                                key={`p-${product.id}`}
                                onClick={() => {
                                  setSearchQuery('');
                                  navigate('/catalog');
                                }}
                                className="p-2 hover:bg-emerald-50 rounded-xl transition-colors cursor-pointer flex items-center gap-3 group"
                              >
                                <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-emerald-100 flex items-center justify-center text-slate-500 group-hover:text-emerald-600 transition-colors">
                                  <Package size={16} weight="bold" />
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-bold text-slate-700 group-hover:text-emerald-700 transition-colors">{product.name}</p>
                                  <p className="text-xs text-slate-400 font-medium">SKU: {product.sku} | ${product.basePrice.toFixed(2)}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  
                  <div className="p-3 border-t border-slate-50 bg-slate-50/50 flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    <span>Resultados de Búsqueda</span>
                    <span><kbd className="bg-white border border-slate-200 rounded px-1.5 py-0.5 shadow-sm text-slate-500">ESC</kbd> para limpiar</span>
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative p-2 transition-colors rounded-xl ${showNotifications ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:bg-slate-50 hover:text-indigo-600'}`}
              >
                <Bell size={22} weight="fill" />
                {alerts.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-3 h-3 bg-rose-500 border-2 border-white rounded-full animate-pulse"></span>
                )}
              </button>
              
              {/* Dropdown Notificaciones */}
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden z-50 animate-in slide-in-from-top-2 fade-in duration-200">
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-bold text-slate-800 text-sm">Notificaciones ({alerts.length})</h3>
                    {alerts.length > 0 && (
                      <button onClick={() => setAlerts([])} className="text-xs text-indigo-600 font-bold hover:text-indigo-700">Ocultar</button>
                    )}
                  </div>
                  
                  <div className="max-h-64 overflow-y-auto custom-scrollbar">
                    {alerts.length === 0 ? (
                      <div className="p-8 text-center text-slate-400">
                        <Bell size={32} weight="duotone" className="mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Todo al día. No hay alertas.</p>
                      </div>
                    ) : (
                      <div className="p-2 space-y-1">
                        {alerts.map((alert) => (
                          <div 
                            key={`alert-${alert.inventoryId}`}
                            onClick={() => {
                              setShowNotifications(false);
                              navigate('/alerts');
                            }}
                            className={`p-3 rounded-xl flex items-start gap-3 cursor-pointer transition-colors border ${
                              alert.severity === 'CRITICAL' 
                                ? 'bg-rose-50/50 hover:bg-rose-50 border-rose-100/50' 
                                : 'bg-amber-50/50 hover:bg-amber-50 border-amber-100/50'
                            }`}
                          >
                            <WarningCircle size={18} weight="fill" className={alert.severity === 'CRITICAL' ? 'text-rose-500' : 'text-amber-500'} />
                            <div>
                              <p className="text-sm font-bold text-slate-700 leading-tight">{alert.productName}</p>
                              <p className="text-[11px] font-medium text-slate-500 mt-0.5">{alert.branchName}</p>
                              <p className={`text-xs mt-1 font-bold ${alert.severity === 'CRITICAL' ? 'text-rose-600' : 'text-amber-600'}`}>
                                Stock: {alert.currentStock} (Mín: {alert.minStockThreshold})
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-3 border-t border-slate-100 text-center bg-slate-50">
                    <button onClick={() => { setShowNotifications(false); navigate('/alerts'); }} className="text-xs text-slate-500 font-bold hover:text-slate-700">Ver panel completo</button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {children}
        </div>
      </main>

    </div>
  );
};
