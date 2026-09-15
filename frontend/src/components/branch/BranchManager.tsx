import { useEffect, useState } from 'react';
import type { Branch } from '../../types';
import { branchService } from '../../services/branchService';

export const BranchManager = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBranches = () => {
    setLoading(true);
    branchService.getAll().then(setBranches).finally(() => setLoading(false));
  };

  useEffect(() => { loadBranches(); }, []);

  const toggleStatus = async (branch: Branch) => {
    try {
      await branchService.update(branch.id, { name: branch.name, address: branch.address, active: !branch.active });
      loadBranches();
    } catch (e) { alert("Error al actualizar estado"); }
  };

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-slate-800 tracking-tight">Sucursales</h2>
        <button className="bg-slate-800 hover:bg-slate-900 text-white px-5 py-2.5 rounded-xl font-medium transition-all duration-300 shadow-sm">
          + Nueva Sucursal
        </button>
      </div>

      {loading ? (
        <div className="h-32 flex items-center justify-center"><div className="animate-spin h-6 w-6 border-4 border-slate-800 border-t-transparent rounded-full"></div></div>
      ) : branches.length === 0 ? (
        <div className="text-center py-10 text-slate-400">No hay sucursales registradas.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {branches.map(b => (
            <div key={b.id} className="p-5 border border-slate-200 rounded-2xl bg-white hover:shadow-md transition-shadow duration-300 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-slate-800">{b.name}</h3>
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${b.active ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {b.active ? 'Activa' : 'Inactiva'}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-2">{b.address || 'Sin dirección registrada'}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100">
                <button onClick={() => toggleStatus(b)} className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${b.active ? 'bg-rose-50 text-rose-600 hover:bg-rose-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}>
                  {b.active ? 'Desactivar Sucursal' : 'Activar Sucursal'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
