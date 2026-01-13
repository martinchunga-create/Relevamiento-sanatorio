
import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { InspectionArea } from '../types';
import { getInspectionInsights } from '../services/geminiService';

interface DashboardProps {
  areas: InspectionArea[];
}

const Dashboard: React.FC<DashboardProps> = ({ areas }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const completed = areas.filter(a => a.progress === 100).length;
  const inProgress = areas.filter(a => a.progress > 0 && a.progress < 100).length;
  const pending = areas.filter(a => a.progress === 0).length;

  const pieData = [
    { name: 'Completados', value: completed, color: '#22c55e' },
    { name: 'En Proceso', value: inProgress, color: '#f59e0b' },
    { name: 'Pendientes', value: pending, color: '#94a3b8' },
  ];

  const handleGetInsights = async () => {
    setLoading(true);
    try {
      const result = await getInspectionInsights(areas);
      setInsight(result);
    } catch (err) {
      setInsight("Error inesperado al procesar el diagnóstico.");
    } finally {
      setLoading(false);
    }
  };

  const simulateSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      alert('¡Sincronización de datos exitosa en el link actual!');
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center">
          <h3 className="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wider">Estado de Relevamiento</h3>
          <div className="h-48 w-full min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={pieData} 
                  innerRadius={60} 
                  outerRadius={80} 
                  paddingAngle={5} 
                  dataKey="value"
                  animationDuration={800}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs font-medium">
            {pieData.map(d => (
              <div key={d.name} className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></span>
                <span className="text-slate-600">{d.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800">IA - Diagnóstico Predictivo</h3>
              <p className="text-sm text-slate-500">Analiza fallas recurrentes y criticidad</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button 
                onClick={simulateSync}
                disabled={syncing}
                className="flex-1 sm:flex-none border border-slate-200 hover:bg-slate-50 text-slate-600 px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                {syncing ? <div className="animate-spin h-3 w-3 border-2 border-slate-400 border-t-transparent rounded-full" /> : 'Sincronizar'}
              </button>
              <button 
                onClick={handleGetInsights}
                disabled={loading}
                className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:bg-blue-300 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                )}
                Obtener Informe
              </button>
            </div>
          </div>

          <div className="min-h-[150px] bg-slate-50 rounded-xl p-5 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap border border-slate-100 overflow-y-auto max-h-[400px]">
            {insight ? insight : "Genere el diagnóstico para ver el análisis de criticidad basado en los datos actuales."}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Ubicaciones', val: `${completed + inProgress}/${areas.length}`, icon: '📍', color: 'blue' },
          { label: 'Defectos Críticos', val: areas.flatMap(a => a.items).filter(i => i.status === 'poor').length.toString(), icon: '⚠️', color: 'red' },
          { label: 'Estado Sync', val: 'Online', icon: '🔗', color: 'green' },
        ].map(card => (
          <div key={card.label} className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4 transition-transform hover:scale-[1.02]">
            <div className={`text-2xl p-3 bg-slate-50 rounded-lg`}>{card.icon}</div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{card.label}</p>
              <p className="text-xl font-bold text-slate-800">{card.val}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
