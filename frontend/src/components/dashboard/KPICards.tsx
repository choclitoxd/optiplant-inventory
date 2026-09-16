import React from 'react';
import type { DashboardMetrics } from '../../types/dashboard';
import { CurrencyCircleDollar, TrendUp, ShoppingCart, Package, ListDashes, Buildings } from '@phosphor-icons/react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color: 'blue' | 'emerald' | 'amber' | 'purple' | 'rose' | 'slate';
  icon: React.ElementType;
}

const KPICard = ({ title, value, subtitle, color, icon: Icon }: KPICardProps) => {
  const colorStyles = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
    slate: 'bg-slate-50 text-slate-600 border-slate-100',
  };

  return (
    <div className={`p-6 rounded-2xl border ${colorStyles[color]} shadow-sm flex items-center gap-5 transition-transform hover:-translate-y-1 hover:shadow-md duration-300`}>
      <div className={`p-4 rounded-full bg-white bg-opacity-60 shadow-sm border border-white/50 text-current flex items-center justify-center`}>
        <Icon weight="duotone" size={32} />
      </div>
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider opacity-80">{title}</h3>
        <p className="text-3xl font-extrabold mt-1">{value}</p>
        {subtitle && <p className="text-xs font-semibold opacity-70 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
};

export const KPICards = ({ metrics }: { metrics: DashboardMetrics }) => {
  const formatCurrency = (val: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(val);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 fade-in duration-500">
      <KPICard 
        title="Valor Total de Inventario" 
        value={formatCurrency(metrics.totalInventoryValue)} 
        subtitle="Global en todas las sucursales"
        color="purple" 
        icon={CurrencyCircleDollar} 
      />
      <KPICard 
        title="Ventas del Mes" 
        value={formatCurrency(metrics.totalMonthlySales)} 
        color="emerald" 
        icon={TrendUp} 
      />
      <KPICard 
        title="Compras del Mes" 
        value={formatCurrency(metrics.totalMonthlyPurchases)} 
        color="amber" 
        icon={ShoppingCart} 
      />
      <KPICard 
        title="Unidades en Stock" 
        value={metrics.totalStockUnits.toLocaleString()} 
        color="blue" 
        icon={Package} 
      />
      <KPICard 
        title="Productos en Catálogo" 
        value={metrics.totalProducts} 
        color="slate" 
        icon={ListDashes} 
      />
      <KPICard 
        title="Sucursales Activas" 
        value={metrics.totalBranches} 
        color="rose" 
        icon={Buildings} 
      />
    </div>
  );
};
