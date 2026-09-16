import { useState } from 'react';
import { PurchaseForm } from '../components/purchase/PurchaseForm';
import { PurchaseHistory } from '../components/purchase/PurchaseHistory';
import { SupplierManager } from '../components/purchase/SupplierManager';

export const PurchasePage = () => {
  const [activeTab, setActiveTab] = useState<'form' | 'history' | 'suppliers'>('form');

  return (
    <div className="p-8">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">
            Recepción de Compras
          </h1>
          <p className="text-slate-500 mt-2 text-sm max-w-xl">
            Registra entradas de inventario desde proveedores. El Costo Promedio Ponderado (CPP) se calculará automáticamente en el sistema central.
          </p>
        </header>
      </div>

      <div className="flex p-1 bg-slate-100/80 rounded-lg mb-8 w-max border border-slate-200 shadow-inner">
        {(['form', 'history', 'suppliers'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 text-sm font-semibold rounded-md transition-all duration-200 ${
              activeTab === tab 
                ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200/50' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            {tab === 'form' ? 'Registrar Compra' : tab === 'history' ? 'Historial de Compras' : 'Proveedores'}
          </button>
        ))}
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {activeTab === 'form' && <PurchaseForm onSuccess={() => setActiveTab('history')} />}
        {activeTab === 'history' && <PurchaseHistory />}
        {activeTab === 'suppliers' && <SupplierManager />}
      </div>
    </div>
  );
};
