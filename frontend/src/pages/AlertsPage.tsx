import React, { useState } from 'react';
import { ClipboardText, Warning, ShieldWarning, PaperPlaneRight, ArrowRight, ClockCounterClockwise } from '@phosphor-icons/react';

export const AlertsPage: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('Actualizado hace 2 min');

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdated('Actualizado justo ahora');
    }, 1200);
  };

  return (
    <div className="w-full font-sans flex flex-col h-full">
      
      {/* 4 y 5 y 7. ENCABEZADO CON MÁS AIRE Y JERARQUÍA */}
      <div className="pt-2 md:pt-4 pb-6 md:pb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-2 border-b border-slate-100/50">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-red-600 mb-2">
            Alertas de Inventario
          </h1>
          <p className="text-[14px] md:text-[15px] text-slate-500 font-medium">
            Supervisa productos con stock bajo o agotado.
          </p>
        </div>
        <button 
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 text-slate-500 text-[12px] bg-white hover:bg-slate-50 hover:text-indigo-600 transition-colors px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm font-medium disabled:opacity-70 disabled:cursor-wait"
        >
          <span>{isRefreshing ? 'Actualizando...' : lastUpdated}</span>
          <ClockCounterClockwise weight="bold" size={14} className={isRefreshing ? "animate-spin text-indigo-500" : "text-slate-400"} />
        </button>
      </div>

      {/* 8. SEPARACIÓN: Header -> KPIs (margen ya manejado por pb del header y pt inferior, pero agregamos gap) */}
      <div className="flex flex-col gap-6 md:gap-8 flex-1">
        
        {/* 2. TARJETAS KPI */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          
          {/* KPI: Total Alertas */}
          <div className="bg-white border border-slate-100 rounded-[20px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all duration-200">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Total Alertas</span>
              <ClipboardText weight="duotone" size={24} className="text-indigo-400" />
            </div>
            <div>
              <h3 className="text-[40px] md:text-[44px] font-black text-indigo-600 leading-none mb-1">04</h3>
              <p className="text-[12px] md:text-[13px] text-slate-400 font-medium">Alertas activas</p>
            </div>
          </div>

          {/* KPI: Críticas */}
          <div className="bg-white border border-slate-100 rounded-[20px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all duration-200">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Críticas</span>
              <Warning weight="fill" size={24} className="text-rose-500 animate-pulse" />
            </div>
            <div>
              <h3 className="text-[40px] md:text-[44px] font-black text-rose-500 leading-none mb-1">02</h3>
              <p className="text-[12px] md:text-[13px] text-slate-400 font-medium">Requieren atención</p>
            </div>
          </div>

          {/* KPI: Advertencias */}
          <div className="bg-white border border-slate-100 rounded-[20px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all duration-200">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Advertencias</span>
              <ShieldWarning weight="duotone" size={24} className="text-amber-500" />
            </div>
            <div>
              <h3 className="text-[40px] md:text-[44px] font-black text-amber-500 leading-none mb-1">02</h3>
              <p className="text-[12px] md:text-[13px] text-slate-400 font-medium">Stock bajo</p>
            </div>
          </div>

        </div>

        {/* 3. DISEÑO BENTO (Layout Inferior expandible) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 pb-8">
          
          {/* PRODUCTOS QUE REQUIEREN ATENCIÓN (Aproximadamente 65-70%) */}
          <div className="lg:col-span-8 bg-white border border-slate-100 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col h-full">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white">
              <h2 className="text-[16px] md:text-[18px] font-bold text-slate-800 uppercase tracking-wide">Productos que requieren atención</h2>
              <button className="text-[13px] font-bold text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1">
                Ver todo <ArrowRight weight="bold" />
              </button>
            </div>
            
            <div className="p-6 flex-1 flex flex-col gap-4">
              
              {/* Fila Producto 1 (Crítico) */}
              <div className="bg-white border border-slate-100 rounded-[16px] p-4 lg:p-5 flex flex-col md:flex-row gap-4 md:items-center justify-between shadow-sm hover:border-slate-200 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1.5">
                    <span className="px-2.5 py-0.5 bg-rose-50 text-rose-600 border border-rose-100 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      Crítico
                    </span>
                    <h3 className="text-[14px] font-bold text-slate-800">Lentes de Contacto Blue</h3>
                  </div>
                  <p className="text-[12px] text-slate-500 font-medium">Sucursal Central</p>
                </div>
                
                <div className="flex flex-row items-center gap-8 md:gap-12">
                  {/* Visual Stock Indicator */}
                  <div className="w-32 lg:w-40">
                    <div className="flex justify-between items-end mb-1.5">
                      <span className="text-[10px] font-bold text-slate-400">STOCK ACTUAL</span>
                      <span className="text-[14px] font-black text-rose-500">0 <span className="text-[11px] text-slate-400 font-medium">/ 10</span></span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-rose-500 h-1.5 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1.5">Mínimo: 10 unidades</p>
                  </div>
                  
                  {/* Reposición Sugerida */}
                  <div className="text-center min-w-[100px]">
                    <span className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Reposición Sugerida</span>
                    <span className="inline-flex items-center justify-center px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-[14px] font-bold">
                      +20 <span className="text-[10px] ml-1 font-medium">unid.</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Fila Producto 2 (Advertencia) */}
              <div className="bg-white border border-slate-100 rounded-[16px] p-4 lg:p-5 flex flex-col md:flex-row gap-4 md:items-center justify-between shadow-sm hover:border-slate-200 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1.5">
                    <span className="px-2.5 py-0.5 bg-amber-50 text-amber-600 border border-amber-100 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      Advertencia
                    </span>
                    <h3 className="text-[14px] font-bold text-slate-800">Gafas de Sol UV400</h3>
                  </div>
                  <p className="text-[12px] text-slate-500 font-medium">Sucursal Norte</p>
                </div>
                
                <div className="flex flex-row items-center gap-8 md:gap-12">
                  {/* Visual Stock Indicator */}
                  <div className="w-32 lg:w-40">
                    <div className="flex justify-between items-end mb-1.5">
                      <span className="text-[10px] font-bold text-slate-400">STOCK ACTUAL</span>
                      <span className="text-[14px] font-black text-amber-500">5 <span className="text-[11px] text-slate-400 font-medium">/ 10</span></span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '50%' }}></div>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1.5">Mínimo: 10 unidades</p>
                  </div>
                  
                  {/* Reposición Sugerida */}
                  <div className="text-center min-w-[100px]">
                    <span className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Reposición Sugerida</span>
                    <span className="inline-flex items-center justify-center px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-[14px] font-bold">
                      +15 <span className="text-[10px] ml-1 font-medium">unid.</span>
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* NOTIFICAR GERENCIA (Aproximadamente 30-35%) */}
          <div className="lg:col-span-4 bg-indigo-600 text-white rounded-[24px] shadow-[0_10px_30px_rgba(79,70,229,0.2)] p-6 md:p-8 flex flex-col justify-between relative overflow-hidden group h-full">
            {/* Fondo sutil decorativo */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors duration-500"></div>
            
            <div className="relative z-10 flex-1">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white mb-6 backdrop-blur-sm border border-white/20 shadow-inner">
                <PaperPlaneRight weight="fill" size={24} />
              </div>
              <h2 className="text-[20px] font-bold mb-3">Notificar a Gerencia</h2>
              <p className="text-[14px] text-indigo-100 leading-relaxed mb-8">
                Envía automáticamente el reporte de inventario crítico para agilizar la reposición.
              </p>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-[11px] font-bold text-indigo-200 mb-2 uppercase tracking-wider">Destinatario</label>
                  <div className="bg-white/10 border border-white/20 rounded-[14px] p-3 backdrop-blur-sm text-[14px] text-white font-medium">
                    gerente@optiplant.com
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-indigo-200 mb-2 uppercase tracking-wider">Mensaje Adjunto</label>
                  <div className="bg-white/10 border border-white/20 rounded-[14px] p-4 backdrop-blur-sm text-[14px] text-white/90 leading-relaxed">
                    Hola, se adjunta el reporte automático de stock crítico. Se recomienda iniciar órdenes de compra...
                  </div>
                </div>
              </div>
            </div>

            <button className="relative z-10 mt-8 w-full py-4 bg-white hover:bg-slate-50 text-indigo-600 font-black text-[15px] rounded-[14px] transition-all shadow-md flex items-center justify-center gap-2 hover:-translate-y-1">
              Enviar reporte <ArrowRight weight="bold" />
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};
