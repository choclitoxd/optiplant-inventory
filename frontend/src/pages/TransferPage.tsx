import { useState } from 'react';
import { TransferSendForm } from '../components/transfer/TransferSendForm';
import { TransferHistory } from '../components/transfer/TransferHistory';

export const TransferPage = () => {
  const [activeTab, setActiveTab] = useState<'send' | 'history'>('send');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSendSuccess = () => {
    setRefreshKey(prev => prev + 1);
    setActiveTab('history');
  };

  const navs = [
    { id: 'send', label: 'Emitir Transferencia' },
    { id: 'history', label: 'Seguimiento y Recepción' }
  ] as const;

  return (
    <div className="w-full h-full font-sans selection:bg-blue-200">
      <div className="w-full flex flex-col h-full">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Logística y Transferencias
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Gestión de envíos entre sucursales de OptiPlant Inventory</p>
        </header>

        <div className="flex flex-wrap gap-2 mb-6 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200 w-fit">
          {navs.map((nav) => (
            <button
              key={nav.id}
              onClick={() => setActiveTab(nav.id)}
              className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                activeTab === nav.id 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {nav.label}
            </button>
          ))}
        </div>

        <div className="animate-in slide-in-from-bottom-2 fade-in duration-300 w-full flex-1">
          {activeTab === 'send' && <TransferSendForm onSuccess={handleSendSuccess} />}
          {activeTab === 'history' && <TransferHistory refreshTrigger={refreshKey} />}
        </div>
      </div>
    </div>
  );
};
