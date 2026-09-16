import { useState } from 'react';
import { ProductCatalog } from '../components/catalog/ProductCatalog';
import { BranchManager } from '../components/branch/BranchManager';
import { BranchStockView } from '../components/branch/BranchStockView';

export const CatalogPage = () => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'branches' | 'stock'>('catalog');

  const navs = [
    { id: 'catalog', label: 'Catálogo de Productos' },
    { id: 'branches', label: 'Gestión de Sucursales' },
    { id: 'stock', label: 'Stock por Sucursal' }
  ] as const;

  return (
    <div className="w-full h-full font-sans selection:bg-indigo-200">
      <div className="w-full flex flex-col h-full">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600">
            OptiPlant Inventory
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Gestión Multi-Sucursal MVP</p>
        </header>

        <div className="flex flex-wrap gap-2 mb-6 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200 w-fit">
          {navs.map((nav) => (
            <button
              key={nav.id}
              onClick={() => setActiveTab(nav.id)}
              className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                activeTab === nav.id 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {nav.label}
            </button>
          ))}
        </div>

        <div className="animate-in slide-in-from-bottom-2 fade-in duration-300 w-full flex-1">
          {activeTab === 'catalog' && <ProductCatalog />}
          {activeTab === 'branches' && <BranchManager />}
          {activeTab === 'stock' && <BranchStockView />}
        </div>
      </div>
    </div>
  );
};
