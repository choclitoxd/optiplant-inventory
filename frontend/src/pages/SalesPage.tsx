import { useState } from 'react';
import { POSForm } from '../components/sale/POSForm';
import { SalesHistory } from '../components/sale/SalesHistory';

export const SalesPage = () => {
  const [activeTab, setActiveTab] = useState<'pos' | 'history'>('pos');
  // State trick to trigger history refresh when a sale is completed
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSaleSuccess = () => {
    setRefreshKey(prev => prev + 1);
    setActiveTab('history');
  };

  const navs = [
    { id: 'pos', label: 'Caja Registradora (POS)' },
    { id: 'history', label: 'Historial de Ventas' }
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-12 font-sans selection:bg-emerald-200">
      <div className="w-full">
        <header className="mb-6 lg:mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">
            Punto de Venta
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Registro de ventas y tickets rápidos.</p>
        </header>

        <div className="flex flex-wrap gap-2 mb-8 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200 w-fit">
          {navs.map((nav) => (
            <button
              key={nav.id}
              onClick={() => setActiveTab(nav.id)}
              className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                activeTab === nav.id 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {nav.label}
            </button>
          ))}
        </div>

        <div className="animate-in slide-in-from-bottom-2 fade-in duration-300">
          {activeTab === 'pos' && <POSForm onSuccess={handleSaleSuccess} />}
          {activeTab === 'history' && <SalesHistory key={refreshKey} />}
        </div>
      </div>
    </div>
  );
};
