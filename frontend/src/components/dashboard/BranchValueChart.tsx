import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { StockValueByBranch } from '../../types/dashboard';
import { ChartBar } from '@phosphor-icons/react';

export const BranchValueChart = ({ data }: { data: StockValueByBranch[] }) => {
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);

  // Colores vibrantes (SaaS modern aesthetics)
  const colors = ['#6366f1', '#10b981', '#f59e0b', '#3b82f6', '#ec4899'];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-700 w-full mb-6">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <ChartBar size={20} weight="duotone" className="text-indigo-500" /> Capital Inmovilizado por Sucursal
        </h2>
        <p className="text-sm text-slate-500 mt-1">Comparativa visual del valor de inventario entre todas las sucursales.</p>
      </div>
      
      {data.length === 0 ? (
        <div className="p-8 text-center text-slate-400 font-medium">No hay datos suficientes para graficar.</div>
      ) : (
        <div className="p-6 h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis 
                dataKey="branchName" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                dy={10}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
              />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', padding: '12px' }}
                formatter={(value: any) => [formatCurrency(Number(value)), 'Valor Inventario']}
                labelStyle={{ fontWeight: 'bold', color: '#334155', marginBottom: '4px' }}
              />
              <Bar 
                dataKey="totalValue" 
                radius={[6, 6, 0, 0]}
                animationDuration={1500}
                animationEasing="ease-out"
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
