import React from 'react';
import { Buildings, Fire } from '@phosphor-icons/react';

// Interfaces for mock data
interface Alert {
  id: number;
  product: string;
  stock: number;
  threshold: number;
  status: 'CRITICAL' | 'WARNING';
}

interface KPI {
  title: string;
  value: string;
  trend: string;
  isPositive: boolean;
  icon: React.ReactNode;
}

interface BranchValue {
  name: string;
  value: number;
  percentage: number;
}

interface TopProduct {
  sku: string;
  name: string;
  sold: number;
  revenue: number;
}

export const DashboardBentoLayout: React.FC = () => {
  const kpis: KPI[] = [
    { title: 'Valorización Inventario', value: '$124,500', trend: '+5.2%', isPositive: true, icon: <DollarIcon /> },
    { title: 'Unidades en Stock', value: '8,432', trend: '-1.4%', isPositive: false, icon: <PackageIcon /> },
    { title: 'Sucursales / Estado', value: '4 / 4', trend: 'Online', isPositive: true, icon: <ServerIcon /> },
  ];

  const alerts: Alert[] = [
    { id: 1, product: 'Lentes de Contacto', stock: 0, threshold: 10, status: 'CRITICAL' },
    { id: 2, product: 'Líquido Multipropósito', stock: 2, threshold: 15, status: 'CRITICAL' },
    { id: 3, product: 'Gafas de Sol Deportivas', stock: 6, threshold: 10, status: 'WARNING' },
  ];

  const branchValues: BranchValue[] = [
    { name: 'Sucursal Central', value: 65000, percentage: 52 },
    { name: 'Sucursal Norte', value: 35000, percentage: 28 },
    { name: 'Sucursal Sur', value: 24500, percentage: 20 },
  ];

  const topProducts: TopProduct[] = [
    { sku: 'L-01', name: 'Lentes de Descanso Blue Defense', sold: 124, revenue: 12400 },
    { sku: 'G-04', name: 'Gafas de Sol UV400', sold: 98, revenue: 8500 },
    { sku: 'L-02', name: 'Líquido Limpiador 500ml', sold: 245, revenue: 3675 },
    { sku: 'A-01', name: 'Armazón Metálico Premium', sold: 45, revenue: 6750 },
    { sku: 'E-03', name: 'Estuche Rígido Plegable', sold: 110, revenue: 1650 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Dashboard Ejecutivo
          </h1>
          <p className="text-slate-500 mt-1">Resumen en tiempo real del inventario y operaciones de OptiPlant.</p>
        </header>

        {/* BENTO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[minmax(160px,auto)]">
          
          {/* Bloque 1: Tarjetas KPI */}
          {kpis.map((kpi, index) => (
            <div key={index} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between hover:border-slate-200 transition-colors">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-500 shadow-sm">
                  {kpi.icon}
                </div>
                <div className={`text-sm font-bold px-3 py-1.5 rounded-full ${kpi.isPositive ? 'text-emerald-600 bg-emerald-50 border border-emerald-100' : 'text-rose-600 bg-rose-50 border border-rose-100'}`}>
                  {kpi.trend}
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-slate-500 text-sm font-medium">{kpi.title}</h3>
                <p className="text-3xl font-black text-slate-800 mt-1 tracking-tight">{kpi.value}</p>
              </div>
            </div>
          ))}

          {/* Bloque 2: Panel de Alertas Críticas */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:col-span-1 lg:col-start-4 lg:row-span-2 flex flex-col hover:border-slate-200 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <AlertIcon />
                Alertas
              </h3>
              <span className="bg-rose-50 text-rose-600 text-xs font-bold px-2.5 py-1 rounded-full border border-rose-100">
                {alerts.length} Activas
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
              {alerts.map((alert) => (
                <div key={alert.id} className={`p-4 rounded-xl border ${alert.status === 'CRITICAL' ? 'border-rose-100 bg-rose-50/50' : 'border-amber-100 bg-amber-50/50'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${alert.status === 'CRITICAL' ? 'text-rose-600 bg-rose-100 animate-pulse border border-rose-200' : 'text-amber-600 bg-amber-100 border border-amber-200'}`}>
                      {alert.status}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">Umbral: {alert.threshold}</span>
                  </div>
                  <h4 className="font-semibold text-slate-700 text-sm leading-tight mb-1">{alert.product}</h4>
                  <p className="text-xs text-slate-500">Stock: <span className={`font-bold ${alert.status === 'CRITICAL' ? 'text-rose-600' : 'text-amber-600'}`}>{alert.stock}</span> unid.</p>
                </div>
              ))}
            </div>

            <button className="mt-4 w-full bg-slate-50 hover:bg-slate-100 text-slate-600 font-medium py-3 rounded-xl border border-slate-200 transition-all text-sm flex items-center justify-center gap-2 shadow-sm">
              <MailIcon /> Enviar Reporte
            </button>
          </div>

          {/* Bloque 3: Gráfico/Tabla de Valorización */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:col-span-2 lg:col-span-2 flex flex-col justify-between hover:border-slate-200 transition-colors">
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-1 flex items-center gap-2">
                <Buildings weight="duotone" className="text-emerald-500" size={24} />
                Valorización por Sucursal
              </h3>
              <p className="text-sm text-slate-500 mb-6">Distribución del capital inmovilizado ($ USD)</p>
            </div>
            
            <div className="space-y-6">
              {branchValues.map((branch, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-slate-600">{branch.name}</span>
                    <span className="font-bold text-emerald-600">${branch.value.toLocaleString()} <span className="text-slate-400 font-normal">({branch.percentage}%)</span></span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden shadow-inner">
                    <div 
                      className="bg-emerald-400 h-3 rounded-full relative transition-all duration-1000 ease-out" 
                      style={{ width: `${branch.percentage}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bloque 5: Accesos Rápidos */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:col-span-1 lg:col-span-1 flex flex-col hover:border-slate-200 transition-colors">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Acciones Rápidas</h3>
            <div className="flex flex-col gap-3 flex-1 justify-center">
              <button className="w-full group relative overflow-hidden bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 text-emerald-600 font-medium py-4 rounded-xl transition-all flex items-center gap-3 px-4 shadow-sm">
                <div className="bg-emerald-100 p-2.5 rounded-lg text-emerald-600 group-hover:scale-110 transition-transform"><CartIcon /></div>
                POS
              </button>
              
              <button className="w-full group relative overflow-hidden bg-sky-50 hover:bg-sky-100 border border-sky-100 text-sky-600 font-medium py-4 rounded-xl transition-all flex items-center gap-3 px-4 shadow-sm">
                <div className="bg-sky-100 p-2.5 rounded-lg text-sky-600 group-hover:scale-110 transition-transform"><TransferIcon /></div>
                Transferencia
              </button>
              
              <button className="w-full group relative overflow-hidden bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 text-indigo-600 font-medium py-4 rounded-xl transition-all flex items-center gap-3 px-4 shadow-sm">
                <div className="bg-indigo-100 p-2.5 rounded-lg text-indigo-600 group-hover:scale-110 transition-transform"><PurchaseIcon /></div>
                Ingresar Compra
              </button>
            </div>
          </div>

          {/* Bloque 4: Ranking Top 5 */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:col-span-3 lg:col-span-3 hover:border-slate-200 transition-colors">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-1 flex items-center gap-2">
                  <Fire weight="duotone" className="text-orange-500" size={24} />
                  Top Productos Más Vendidos
                </h3>
                <p className="text-sm text-slate-500">Volumen de salidas del mes actual</p>
              </div>
              <button className="text-sm text-indigo-500 hover:text-indigo-600 font-bold flex items-center gap-1">Ver reporte <span className="text-lg">→</span></button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead>
                  <tr className="text-slate-500 border-b border-slate-100 bg-slate-50/50">
                    <th className="pb-3 pt-2 font-semibold px-4 rounded-tl-lg">SKU</th>
                    <th className="pb-3 pt-2 font-semibold px-4">Producto</th>
                    <th className="pb-3 pt-2 font-semibold text-right px-4">Unidades</th>
                    <th className="pb-3 pt-2 font-semibold text-right px-4 rounded-tr-lg">Ingresos</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {topProducts.map((p, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors group">
                      <td className="py-3.5 px-4 font-mono text-xs text-slate-400 group-hover:text-slate-500">{p.sku}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-700">{p.name}</td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-slate-600 font-bold">
                          {p.sold}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-black text-emerald-500 group-hover:text-emerald-600">${p.revenue.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const DollarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>;
const PackageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>;
const ServerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>;
const AlertIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rose-500"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>;
const MailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>;
const CartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"></circle><circle cx="19" cy="21" r="1"></circle><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path></svg>;
const TransferIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 16 4-4-4-4"></path><path d="m6 8-4 4 4 4"></path><path d="m14.5 4-5 16"></path></svg>;
const PurchaseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>;
