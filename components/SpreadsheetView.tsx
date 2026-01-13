
import React from 'react';
import { InspectionArea, Status } from '../types';

interface SpreadsheetViewProps {
  areas: InspectionArea[];
}

const SpreadsheetView: React.FC<SpreadsheetViewProps> = ({ areas }) => {
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
    link.setAttribute('download', `relevamiento_${new Date().toISOString().split('T')[0]}.csv`);
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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Planilla de Control</h2>
          <p className="text-sm text-slate-500">Historial completo de elementos</p>
        </div>
        <button 
          onClick={exportToCSV}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-sm transition-all"
        >
          Descargar CSV / Excel
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Ubicación</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Elemento</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Estado</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Comentario</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {flattenedData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-slate-800 text-sm">{row.areaName}</p>
                    <p className="text-[10px] text-slate-400">Piso {row.floor}</p>
                  </td>
                  <td className="p-4 text-sm text-slate-600 font-medium">{row.itemLabel}</td>
                  <td className="p-4">{getStatusBadge(row.status)}</td>
                  <td className="p-4 text-xs text-slate-500 italic truncate max-w-[150px]">{row.comment || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SpreadsheetView;
