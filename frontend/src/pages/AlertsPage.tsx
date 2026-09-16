import React, { useState, useEffect, useMemo } from 'react';
import { ClipboardText, Warning, ShieldWarning, PaperPlaneRight, ArrowRight, ClockCounterClockwise } from '@phosphor-icons/react';
import { alertService } from '../services/alertService';
import type { StockAlert } from '../types/stockAlert';

export const AlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('Actualizado justo ahora');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('gerente@optiplant.com');

  const fetchAlerts = async () => {
    try {
      const data = await alertService.getLowStockAlerts();
      setAlerts(data);
    } catch (error) {
      console.error("Error fetching alerts:", error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchAlerts();
    setLastUpdated('Actualizado justo ahora');
  };

  const handleSendReport = async () => {
    setSendingEmail(true);
    try {
      await alertService.sendEmailReport(recipientEmail);
      alert('Reporte enviado con éxito a la gerencia.');
    } catch (error) {
      console.error("Error sending email:", error);
      alert('Hubo un error al enviar el reporte.');
    } finally {
      setSendingEmail(false);
    }
  };

  const metrics = useMemo(() => {
    const critical = alerts.filter(a => a.severity === 'CRITICAL').length;
    const warning = alerts.filter(a => a.severity === 'WARNING').length;
    return {
      total: alerts.length,
      critical,
      warning
    };
  }, [alerts]);

  return (
    <div className="w-full font-sans flex flex-col h-full">
      
      {/* ENCABEZADO */}
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
          disabled={isRefreshing || loading}
          className="flex items-center gap-2 text-slate-500 text-[12px] bg-white hover:bg-slate-50 hover:text-indigo-600 transition-colors px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm font-medium disabled:opacity-70 disabled:cursor-wait"
        >
          <span>{isRefreshing || loading ? 'Actualizando...' : lastUpdated}</span>
          <ClockCounterClockwise weight="bold" size={14} className={isRefreshing || loading ? "animate-spin text-indigo-500" : "text-slate-400"} />
        </button>
      </div>

      <div className="flex flex-col gap-6 md:gap-8 flex-1">
        
        {/* TARJETAS KPI */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-white border border-slate-100 rounded-[20px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all duration-200">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Total Alertas</span>
              <ClipboardText weight="duotone" size={24} className="text-indigo-400" />
            </div>
            <div>
              <h3 className="text-[40px] md:text-[44px] font-black text-indigo-600 leading-none mb-1">
                {String(metrics.total).padStart(2, '0')}
              </h3>
              <p className="text-[12px] md:text-[13px] text-slate-400 font-medium">Alertas activas</p>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-[20px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all duration-200">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Críticas</span>
              <Warning weight="fill" size={24} className={metrics.critical > 0 ? "text-rose-500 animate-pulse" : "text-slate-300"} />
            </div>
            <div>
              <h3 className={`text-[40px] md:text-[44px] font-black leading-none mb-1 ${metrics.critical > 0 ? "text-rose-500" : "text-slate-800"}`}>
                {String(metrics.critical).padStart(2, '0')}
              </h3>
              <p className="text-[12px] md:text-[13px] text-slate-400 font-medium">Requieren atención</p>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-[20px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all duration-200">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Advertencias</span>
              <ShieldWarning weight="duotone" size={24} className={metrics.warning > 0 ? "text-amber-500" : "text-slate-300"} />
            </div>
            <div>
              <h3 className={`text-[40px] md:text-[44px] font-black leading-none mb-1 ${metrics.warning > 0 ? "text-amber-500" : "text-slate-800"}`}>
                {String(metrics.warning).padStart(2, '0')}
              </h3>
              <p className="text-[12px] md:text-[13px] text-slate-400 font-medium">Stock bajo</p>
            </div>
          </div>
        </div>

        {/* DISEÑO BENTO */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 pb-8">
          
          {/* PRODUCTOS QUE REQUIEREN ATENCIÓN */}
          <div className="lg:col-span-8 bg-white border border-slate-100 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col h-full min-h-[400px]">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white">
              <h2 className="text-[16px] md:text-[18px] font-bold text-slate-800 uppercase tracking-wide">Productos que requieren atención</h2>
              {alerts.length > 0 && (
                <span className="text-[13px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                  {alerts.length} registros
                </span>
              )}
            </div>
            
            <div className="p-6 flex-1 flex flex-col gap-4 overflow-y-auto custom-scrollbar max-h-[600px]">
              
              {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                  <ClockCounterClockwise size={40} className="animate-spin mb-4 opacity-50" />
                  <p className="font-medium text-sm">Cargando alertas de inventario...</p>
                </div>
              ) : alerts.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 min-h-[300px]">
                  <ShieldWarning size={48} weight="duotone" className="text-emerald-400 mb-4" />
                  <p className="font-bold text-slate-600">Stock Saludable</p>
                  <p className="text-sm mt-1">No hay productos con niveles de inventario bajos o críticos en ninguna sucursal.</p>
                </div>
              ) : (
                alerts.map((alert) => (
                  <div key={alert.inventoryId} className="bg-white border border-slate-100 rounded-[16px] p-4 lg:p-5 flex flex-col md:flex-row gap-4 md:items-center justify-between shadow-sm hover:border-slate-200 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1.5">
                        {alert.severity === 'CRITICAL' ? (
                          <span className="px-2.5 py-0.5 bg-rose-50 text-rose-600 border border-rose-100 rounded-full text-[10px] font-bold uppercase tracking-wider">
                            Crítico
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 bg-amber-50 text-amber-600 border border-amber-100 rounded-full text-[10px] font-bold uppercase tracking-wider">
                            Advertencia
                          </span>
                        )}
                        <h3 className="text-[14px] font-bold text-slate-800">{alert.productName}</h3>
                      </div>
                      <p className="text-[12px] text-slate-500 font-medium">Sucursal: {alert.branchName}</p>
                    </div>
                    
                    <div className="flex flex-row items-center gap-8 md:gap-12">
                      <div className="w-32 lg:w-40">
                        <div className="flex justify-between items-end mb-1.5">
                          <span className="text-[10px] font-bold text-slate-400">STOCK ACTUAL</span>
                          <span className={`text-[14px] font-black ${alert.severity === 'CRITICAL' ? 'text-rose-500' : 'text-amber-500'}`}>
                            {alert.currentStock} <span className="text-[11px] text-slate-400 font-medium">/ {alert.minStockThreshold}</span>
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className={`${alert.severity === 'CRITICAL' ? 'bg-rose-500' : 'bg-amber-500'} h-1.5 rounded-full transition-all`} 
                            style={{ width: `${Math.min(100, (alert.currentStock / alert.minStockThreshold) * 100)}%` }}
                          ></div>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1.5">Mínimo: {alert.minStockThreshold} unidades</p>
                      </div>
                      
                      <div className="text-center min-w-[100px]">
                        <span className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Reposición Sugerida</span>
                        <span className="inline-flex items-center justify-center px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-[14px] font-bold">
                          +{alert.suggestedReorderQuantity} <span className="text-[10px] ml-1 font-medium">unid.</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}

            </div>
          </div>

          {/* NOTIFICAR GERENCIA */}
          <div className="lg:col-span-4 bg-indigo-600 text-white rounded-[24px] shadow-[0_10px_30px_rgba(79,70,229,0.2)] p-6 md:p-8 flex flex-col justify-between relative overflow-hidden group h-full">
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
                  <input 
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-[14px] p-3 backdrop-blur-sm text-[14px] text-white font-medium outline-none focus:border-white/40 focus:bg-white/20 transition-colors placeholder:text-white/50"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-indigo-200 mb-2 uppercase tracking-wider">Mensaje Adjunto</label>
                  <textarea 
                    defaultValue={`Hola, se adjunta el reporte automático de stock crítico en ${alerts.length} productos. Se recomienda iniciar órdenes de compra...`}
                    rows={3}
                    className="w-full bg-white/10 border border-white/20 rounded-[14px] p-4 backdrop-blur-sm text-[14px] text-white/90 leading-relaxed outline-none focus:border-white/40 focus:bg-white/20 transition-colors resize-none custom-scrollbar placeholder:text-white/50"
                  ></textarea>
                </div>
              </div>
            </div>

            <button 
              onClick={handleSendReport}
              disabled={alerts.length === 0 || sendingEmail}
              className="relative z-10 mt-8 w-full py-4 bg-white hover:bg-slate-50 disabled:bg-slate-300 disabled:text-slate-500 text-indigo-600 font-black text-[15px] rounded-[14px] transition-all shadow-md flex items-center justify-center gap-2 hover:-translate-y-1 disabled:hover:translate-y-0"
            >
              {sendingEmail ? 'Enviando...' : 'Enviar reporte'} <ArrowRight weight="bold" />
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};
