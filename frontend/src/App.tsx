import { useState } from 'react';
import { CatalogPage } from './pages/CatalogPage';
import { PurchasePage } from './pages/PurchasePage';
import { SalesPage } from './pages/SalesPage';
import { TransferPage } from './pages/TransferPage';

function App() {
  const [currentRoute, setCurrentRoute] = useState<'catalog' | 'purchases' | 'sales' | 'transfers'>('catalog');

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar minimalista */}
      <nav className="w-64 bg-slate-900 text-white p-6 flex flex-col shadow-xl z-10">
        <div className="mb-10">
          <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
            OptiPlant
          </h1>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-bold">Inventory System</p>
        </div>
        
        <div className="flex flex-col gap-2">
          <button 
            onClick={() => setCurrentRoute('catalog')}
            className={`text-left px-4 py-3 rounded-xl font-medium transition-colors ${currentRoute === 'catalog' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
          >
            📦 Catálogo y Stock
          </button>
          <button 
            onClick={() => setCurrentRoute('purchases')}
            className={`text-left px-4 py-3 rounded-xl font-medium transition-colors ${currentRoute === 'purchases' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
          >
            📥 Recepción (Compras)
          </button>
          <button 
            onClick={() => setCurrentRoute('sales')}
            className={`text-left px-4 py-3 rounded-xl font-medium transition-colors ${currentRoute === 'sales' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/50' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
          >
            💰 Punto de Venta (POS)
          </button>
          <button 
            onClick={() => setCurrentRoute('transfers')}
            className={`text-left px-4 py-3 rounded-xl font-medium transition-colors ${currentRoute === 'transfers' ? 'bg-blue-600 text-white shadow-md shadow-blue-900/50' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
          >
            🚚 Logística (Transferencias)
          </button>
        </div>
      </nav>

      {/* Contenido principal */}
      <main className="flex-1 overflow-x-hidden">
        {currentRoute === 'catalog' && <CatalogPage />}
        {currentRoute === 'purchases' && <PurchasePage />}
        {currentRoute === 'sales' && <SalesPage />}
        {currentRoute === 'transfers' && <TransferPage />}
      </main>
    </div>
  );
}

export default App;
