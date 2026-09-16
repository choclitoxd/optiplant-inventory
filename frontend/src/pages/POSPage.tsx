import React, { useState } from 'react';

export const POSPage: React.FC = () => {
  const [cart] = useState<{ id: string, name: string, price: number, qty: number }[]>([
    { id: '1', name: 'Lentes de Contacto Blue', price: 45.00, qty: 2 },
    { id: '2', name: 'Líquido Limpiador 500ml', price: 12.50, qty: 1 }
  ]);

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6 auto-rows-max h-full">
      
      {/* Catálogo y Filtros */}
      <div className="col-span-12 lg:col-span-7 bg-white border border-slate-100 rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-slate-200 transition-all duration-300 flex flex-col min-h-[400px]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800">Catálogo de Productos</h2>
          <div className="flex gap-2">
            <button className="px-4 py-1.5 bg-indigo-50 text-indigo-600 text-sm font-medium rounded-lg border border-indigo-100 hover:bg-indigo-100 transition-colors">Todos</button>
            <button className="px-4 py-1.5 bg-white text-slate-500 text-sm font-medium rounded-lg border border-slate-200 hover:bg-slate-50 hover:text-slate-800 transition-colors">Lentes</button>
            <button className="px-4 py-1.5 bg-white text-slate-500 text-sm font-medium rounded-lg border border-slate-200 hover:bg-slate-50 hover:text-slate-800 transition-colors">Accesorios</button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 overflow-y-auto custom-scrollbar flex-1 pr-2">
          {/* Mock Products */}
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between group cursor-pointer hover:border-emerald-200 hover:bg-emerald-50/30 transition-all">
              <div className="w-full h-24 bg-white rounded-xl mb-3 flex items-center justify-center text-4xl group-hover:scale-105 transition-transform shadow-sm">
                👓
              </div>
              <div>
                <p className="text-xs text-emerald-600 font-bold mb-1">Stock: {20 - i}</p>
                <h3 className="text-sm font-bold text-slate-700 leading-tight mb-2">Producto de Prueba {i}</h3>
                <div className="flex justify-between items-end">
                  <span className="text-lg font-black text-slate-800">${(15.99 * i).toFixed(2)}</span>
                  <button className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Carrito de Ventas */}
      <div className="col-span-12 lg:col-span-5 lg:row-span-2 bg-white border border-slate-100 rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-slate-200 transition-all duration-300 flex flex-col">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Carrito Actual</h2>
        
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
          {cart.map((item) => (
            <div key={item.id} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex justify-between items-center group hover:border-slate-200 transition-colors">
              <div className="flex-1">
                <h4 className="text-sm font-bold text-slate-700">{item.name}</h4>
                <p className="text-emerald-600 font-medium text-sm">${item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-white rounded-lg p-1 border border-slate-200 shadow-sm">
                  <button className="w-7 h-7 flex items-center justify-center text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors">-</button>
                  <span className="w-8 text-center text-sm font-bold text-slate-800">{item.qty}</span>
                  <button className="w-7 h-7 flex items-center justify-center text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors">+</button>
                </div>
                <div className="w-16 text-right">
                  <span className="font-bold text-slate-800">${(item.price * item.qty).toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-slate-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-500 font-medium">Subtotal</span>
            <span className="font-bold text-slate-700">$102.50</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-slate-500 font-medium">Impuestos (16%)</span>
            <span className="font-bold text-slate-700">$16.40</span>
          </div>
          <div className="flex justify-between items-center mb-6">
            <span className="text-lg font-bold text-slate-700">Total a Cobrar</span>
            <span className="text-3xl font-black text-emerald-600 tracking-tight">$118.90</span>
          </div>
        </div>
      </div>

      {/* Métodos de Pago y Checkout */}
      <div className="col-span-12 lg:col-span-7 bg-white border border-slate-100 rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-slate-200 transition-all duration-300">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Método de Pago</h2>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <button className="py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 font-bold hover:bg-emerald-100 transition-colors shadow-sm">Efectivo</button>
          <button className="py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-100 hover:text-slate-800 transition-colors shadow-sm">Tarjeta CR/DB</button>
          <button className="py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-100 hover:text-slate-800 transition-colors shadow-sm">Transferencia</button>
        </div>
        <button className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-lg rounded-2xl transition-all shadow-[0_4px_14px_0_rgb(16,185,129,0.39)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.23)] hover:-translate-y-1">
          Completar Venta ($118.90)
        </button>
      </div>

    </div>
  );
};
