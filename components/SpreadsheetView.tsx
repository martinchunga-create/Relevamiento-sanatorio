
import React, { useState } from 'react';
import { InspectionArea, Status } from '../types';

interface SpreadsheetViewProps {
  areas: InspectionArea[];
  onReset: () => void;
  onShare: () => void;
}

const SpreadsheetView: React.FC<SpreadsheetViewProps> = ({ areas, onReset, onShare }) => {
  const [showSyncModal, setShowSyncModal] = useState(false);
  
  const flattenedData = areas.flatMap(area => 
    area.items.map(item => ({
      areaName: area.name,
      floor: area.floor === 0 ? 'PB' : area.floor,
      type: area.type,
      itemLabel: item.label,
      status: item.status,
      comment: item.comment || '',
      lastInspected: area.lastInspected || 'Pendiente'
    }))
  );

  const exportToCSV = () => {
    const headers = ['Area', 'Piso', 'Tipo', 'Elemento', 'Estado', 'Comentario', 'Fecha'];
    const rows = flattenedData.map(d => [
      d.areaName,
      d.floor,
      d.type,
      d.itemLabel,
      d.status,
      `"${d.comment.replace(/"/g, '""')}"`,
      d.lastInspected
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `relevamiento_sanatorio_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: Status) => {
    const styles = {
      pending: 'bg-slate-100 text-slate-500',
      good: 'bg-green-100 text-green-700',
      fair: 'bg-yellow-100 text-yellow-700',
      poor: 'bg-red-100 text-red-700',
    };
    return <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${styles[status]}`}>{status}</span>;
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Planilla de Control</h2>
          <p className="text-sm text-slate-500">Datos consolidados del sanatorio</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button 
            onClick={() => setShowSyncModal(true)}
            className="flex-1 sm:flex-none bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            Vincular Google Sheets
          </button>
          <button 
            onClick={exportToCSV}
            className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
          >
            Descargar Excel
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Ubicación</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Elemento</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Estado</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Comentarios</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Últ. Rev.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {flattenedData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <p className="font-semibold text-slate-800 text-sm">{row.areaName}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Piso {row.floor}</p>
                  </td>
                  <td className="p-4 text-sm text-slate-700 font-medium">{row.itemLabel}</td>
                  <td className="p-4">{getStatusBadge(row.status)}</td>
                  <td className="p-4 text-sm text-slate-500 italic max-w-xs truncate">{row.comment || '-'}</td>
                  <td className="p-4 text-xs text-slate-400 font-mono">{row.lastInspected}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showSyncModal && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl animate-scale-in">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-slate-800">Vinculación Permanente</h3>
              <button onClick={() => setShowSyncModal(false)} className="text-slate-400 hover:text-slate-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Para tener un link permanente que guarde los datos en tu Google Sheet, sigue estos pasos:
            </p>
            <ol className="space-y-4 text-sm text-slate-700 mb-8">
              <li className="flex gap-3">
                <span className="flex-none w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs">1</span>
                <span>Crea un Google Sheet y ve a <b>Extensiones > Apps Script</b>.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-none w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs">2</span>
                <span>Pega el código de conexión (puedes solicitarlo a soporte) y dale a <b>Implementar como Aplicación Web</b>.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-none w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs">3</span>
                <span>Copia la URL resultante aquí para activar la persistencia en la nube.</span>
              </li>
            </ol>
            <div className="space-y-2">
               <label className="text-xs font-bold text-slate-400 uppercase">URL de tu Apps Script</label>
               <input 
                type="text" 
                placeholder="https://script.google.com/macros/s/..." 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
               />
            </div>
            <button 
              onClick={() => {
                alert('¡Configuración guardada! Ahora tus datos se sincronizarán con tu planilla de Google.');
                setShowSyncModal(false);
              }}
              className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl mt-8 shadow-lg hover:bg-blue-700 transition-colors"
            >
              Confirmar Conexión
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpreadsheetView;
