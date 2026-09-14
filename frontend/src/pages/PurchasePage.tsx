import { useState } from 'react';
import { PurchaseForm } from '../components/PurchaseForm';
import { PurchaseHistory } from '../components/PurchaseHistory';
import { SupplierManager } from '../components/SupplierManager';

type Tab = 'form' | 'history' | 'suppliers';

export const PurchasePage = () => {
  const [activeTab, setActiveTab] = useState<Tab>('form');
  const [refreshHistory, setRefreshHistory] = useState(0);

  const handlePurchaseSuccess = () => {
    setRefreshHistory(prev => prev + 1);
    setActiveTab('history');
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Módulo de Compras</h1>
          <p className="text-slate-500 mt-1">Gestión de abastecimiento, proveedores y cálculo de CPP</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex space-x-2 bg-slate-100/50 p-1 rounded-xl w-fit border border-slate-200">
        <button onClick={() => setActiveTab('form')} className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${activeTab === 'form' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:bg-slate-200/50'}`}>Registrar Compra</button>
        <button onClick={() => setActiveTab('history')} className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${activeTab === 'history' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:bg-slate-200/50'}`}>Historial</button>
        <button onClick={() => setActiveTab('suppliers')} className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${activeTab === 'suppliers' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:bg-slate-200/50'}`}>Proveedores</button>
      </div>

      {/* Content Area */}
      <div className="mt-6">
        {activeTab === 'form' && <PurchaseForm onSuccess={handlePurchaseSuccess} />}
        {activeTab === 'history' && <PurchaseHistory refreshTrigger={refreshHistory} />}
        {activeTab === 'suppliers' && <SupplierManager />}
      </div>
    </div>
  );
};
