import { useState, useEffect } from 'react';
import type { StockAlert } from '../types/stockAlert';
import { alertService } from '../services/alertService';
import { AlertPanel } from '../components/alerts/AlertPanel';
import { EmailReportModal } from '../components/alerts/EmailReportModal';

export const AlertsPage = () => {
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchAlerts = async () => {
      setLoading(true);
      try {
        const data = await alertService.getLowStockAlerts();
        setAlerts(data);
      } catch (error) {
        console.error("Error fetching alerts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, [refreshKey]);

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-12 font-sans selection:bg-rose-200">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              Alertas de Inventario
            </h1>
            <p className="text-slate-500 mt-2 font-medium">Monitoreo activo de quiebres de stock</p>
          </div>
          <button 
            onClick={() => setRefreshKey(prev => prev + 1)}
            disabled={loading}
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold hover:bg-slate-50 transition-all disabled:opacity-50"
          >
            {loading ? 'Sincronizando...' : '↻ Refrescar'}
          </button>
        </header>

        {loading && alerts.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
          </div>
        ) : (
          <AlertPanel 
            alerts={alerts} 
            onOpenEmailModal={() => setIsModalOpen(true)} 
          />
        )}
      </div>

      <EmailReportModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};
