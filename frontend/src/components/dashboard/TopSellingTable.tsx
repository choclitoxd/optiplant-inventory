import type { TopSellingProduct } from '../../types/dashboard';

export const TopSellingTable = ({ data }: { data: TopSellingProduct[] }) => {
  const formatCurrency = (val: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(val);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-700 delay-150 fill-mode-both">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          🔥 Top Productos Más Vendidos
        </h2>
        <p className="text-sm text-slate-500 mt-1">Ranking de productos con mayor volumen de unidades vendidas.</p>
      </div>

      {data.length === 0 ? (
        <div className="p-8 text-center text-slate-400 font-medium">No se han registrado ventas todavía.</div>
      ) : (
        <div className="p-4 space-y-3">
          {data.map((product, index) => (
            <div key={product.productId} className="flex items-center p-4 rounded-xl border border-slate-100 bg-white hover:border-blue-200 hover:shadow-sm transition-all group">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-lg mr-4 shadow-inner
                ${index === 0 ? 'bg-amber-100 text-amber-600' : 
                  index === 1 ? 'bg-slate-200 text-slate-500' : 
                  index === 2 ? 'bg-orange-100 text-orange-600' : 
                  'bg-blue-50 text-blue-500'}`
              }>
                {index + 1}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{product.productName}</h3>
                <p className="text-xs font-semibold text-slate-400 mt-0.5">SKU: {product.productSku}</p>
              </div>
              <div className="text-right">
                <p className="font-extrabold text-lg text-emerald-600">{formatCurrency(product.totalRevenue)}</p>
                <p className="text-xs font-bold text-slate-500 mt-0.5">{product.totalUnitsSold} unds. vendidas</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
