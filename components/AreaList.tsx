
import React from 'react';
import { InspectionArea } from '../types';

interface AreaListProps {
  areas: InspectionArea[];
  onSelect: (area: InspectionArea) => void;
}

const AreaList: React.FC<AreaListProps> = ({ areas, onSelect }) => {
  // Explicitly type sort parameters as numbers to resolve arithmetic operation errors
  const floors = Array.from(new Set(areas.map(a => a.floor))).sort((a: number, b: number) => a - b);

  return (
    <div className="space-y-8">
      {floors.map(floor => (
        <section key={floor} className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
              {floor === 0 ? 'Planta Baja' : `Piso ${floor}`}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {areas.filter(a => a.floor === floor).map(area => (
              <button
                key={area.id}
                onClick={() => onSelect(area)}
                className="group relative bg-white border border-slate-200 rounded-2xl p-5 text-left transition-all hover:shadow-md hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className={`p-2 rounded-lg ${
                    area.type === 'room' ? 'bg-blue-50 text-blue-600' :
                    area.type === 'common' ? 'bg-purple-50 text-purple-600' :
                    'bg-amber-50 text-amber-600'
                  }`}>
                    {area.type === 'room' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    )}
                    {area.type === 'common' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    )}
                    {area.type === 'service' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                    )}
                  </div>
                  {area.progress === 100 && (
                    <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter">LISTO</span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">{area.name}</h3>
                <p className="text-sm text-slate-500 mb-4">
                  {area.items.length} puntos de control
                </p>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${area.progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                    style={{ width: `${area.progress}%` }}
                  />
                </div>
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default AreaList;
