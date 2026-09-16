import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
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
  CaretRight
} from '@phosphor-icons/react';

interface BentoAppLayoutProps {
  children: React.ReactNode;
}

export const BentoAppLayout: React.FC<BentoAppLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: SquaresFour },
    { name: 'Alertas Stock', path: '/alerts', icon: WarningCircle, badge: 4 },
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
                      
                      {/* Badge visible en expandido */}
                      {item.badge && isSidebarOpen && (
                        <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-rose-500/10 text-rose-500 text-[10px] font-bold border border-rose-500/20">
                          {item.badge}
                        </span>
                      )}
                      
                      {/* Tooltip visible solo en colapsado */}
                      {!isSidebarOpen && (
                        <div className="absolute left-full ml-3 px-3 py-2 bg-slate-800 text-white text-[12px] font-bold rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-xl border border-slate-700 flex items-center gap-2">
                          {item.name}
                          {item.badge && (
                            <span className="flex items-center justify-center min-w-[18px] h-4 px-1 rounded-full bg-rose-500/20 text-rose-400 text-[9px] font-bold">
                              {item.badge}
                            </span>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
        
        {/* Usuario Inferior */}
        <div className={`p-4 mt-auto border-t border-slate-800 flex items-center ${isSidebarOpen ? 'gap-3 justify-start' : 'justify-center'}`}>
          <div className="w-10 h-10 min-w-[40px] rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-indigo-400 text-sm">
            AD
          </div>
          {isSidebarOpen && (
            <div className="flex-1 overflow-hidden whitespace-nowrap">
              <p className="text-[13px] font-bold truncate text-slate-200">Admin User</p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Online</p>
              </div>
            </div>
          )}
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
                placeholder="Buscar productos, sucursales, alertas..." 
                className="w-full bg-transparent outline-none text-slate-700 font-medium placeholder:text-slate-400 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery) {
                    setIsSearching(true);
                    setTimeout(() => {
                      setIsSearching(false);
                      setSearchQuery('');
                      alert(`Resultados para: "${searchQuery}"`);
                    }, 800);
                  }
                }}
              />
              
              {isSearching && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2">
                  <div className="animate-spin w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full"></div>
                </div>
              )}
            </div>

            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative p-2 transition-colors rounded-xl ${showNotifications ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:bg-slate-50 hover:text-indigo-600'}`}
              >
                <Bell size={22} weight="fill" />
                <span className="absolute top-1 right-1.5 w-2 h-2 rounded-full bg-rose-500 border border-white"></span>
              </button>
              
              {/* Dropdown Notificaciones */}
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden z-50 animate-in slide-in-from-top-2 fade-in duration-200">
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-bold text-slate-800 text-sm">Notificaciones</h3>
                    <button className="text-xs text-indigo-600 font-bold hover:text-indigo-700">Marcar leídas</button>
                  </div>
                  <div className="p-2">
                    <div className="p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer flex gap-3 items-start">
                      <div className="mt-0.5 w-2 h-2 rounded-full bg-rose-500 shrink-0"></div>
                      <div>
                        <p className="text-sm text-slate-700 font-medium leading-snug">Stock crítico en <span className="font-bold">Lentes de Contacto Blue</span></p>
                        <p className="text-xs text-slate-400 mt-1">Hace 2 min</p>
                      </div>
                    </div>
                    <div className="p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer flex gap-3 items-start">
                      <div className="mt-0.5 w-2 h-2 rounded-full bg-amber-500 shrink-0"></div>
                      <div>
                        <p className="text-sm text-slate-700 font-medium leading-snug">Transferencia TR-8490 recibida</p>
                        <p className="text-xs text-slate-400 mt-1">Hace 1 hr</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 border-t border-slate-100 text-center">
                    <button className="text-xs text-slate-500 font-bold hover:text-slate-700">Ver todas</button>
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
