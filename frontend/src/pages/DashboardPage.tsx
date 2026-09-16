import { useState, useEffect } from 'react';
import type { DashboardMetrics, StockValueByBranch, TopSellingProduct } from '../types/dashboard';
import { dashboardService } from '../services/dashboardService';
import { KPICards } from '../components/dashboard/KPICards';
import { BranchValueTable } from '../components/dashboard/BranchValueTable';
import { BranchValueChart } from '../components/dashboard/BranchValueChart';
import { TopSellingTable } from '../components/dashboard/TopSellingTable';
import { ArrowsClockwise } from '@phosphor-icons/react';

export const DashboardPage = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [branchValues, setBranchValues] = useState<StockValueByBranch[]>([]);
  const [topProducts, setTopProducts] = useState<TopSellingProduct[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [mRes, bRes, tRes] = await Promise.all([
          dashboardService.getDashboardMetrics(),
          dashboardService.getInventoryValueByBranch(),
          dashboardService.getTopSellingProducts(5)
        ]);
        
        setMetrics(mRes);
        setBranchValues(bRes);
        setTopProducts(tRes);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [refreshKey]);

  return (
    <div className="w-full h-full font-sans selection:bg-blue-200">
      <div className="w-full flex flex-col h-full">
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Panel de Análisis
            </h1>
            <p className="text-slate-500 mt-2 font-medium">Resumen ejecutivo y estado del capital inmovilizado</p>
          </div>
          <button 
            onClick={() => setRefreshKey(prev => prev + 1)}
            disabled={loading}
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-bold hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all disabled:opacity-50"
          >
            <ArrowsClockwise size={18} weight="bold" className={loading ? 'animate-spin' : ''} />
            {loading ? 'Actualizando...' : 'Actualizar Datos'}
          </button>
        </header>

        {loading && !metrics ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : metrics ? (
          <>
            <KPICards metrics={metrics} />
            
            <div className="mt-8">
              <BranchValueChart data={branchValues} />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
              <BranchValueTable data={branchValues} totalValue={metrics.totalInventoryValue} />
              <TopSellingTable data={topProducts} />
            </div>
          </>
        ) : (
          <div className="bg-rose-50 text-rose-600 p-6 rounded-2xl border border-rose-100 text-center font-medium">
            No se pudo cargar la información del Dashboard. Verifica tu conexión al backend.
          </div>
        )}
      </div>
    </div>
  );
};
