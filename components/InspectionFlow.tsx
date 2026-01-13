
import React, { useState } from 'react';
import { InspectionArea, Status, CheckItem } from '../types';

interface InspectionFlowProps {
  area: InspectionArea;
  onSave: (updatedArea: InspectionArea) => void;
  onCancel: () => void;
}

const InspectionFlow: React.FC<InspectionFlowProps> = ({ area, onSave, onCancel }) => {
  const [items, setItems] = useState<CheckItem[]>(area.items);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const currentItem = items[currentIndex];

  const updateStatus = (status: Status) => {
    const newItems = [...items];
    newItems[currentIndex] = { ...currentItem, status };
    setItems(newItems);
  };

  const updateComment = (comment: string) => {
    const newItems = [...items];
    newItems[currentIndex] = { ...currentItem, comment };
    setItems(newItems);
  };

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      const completedCount = items.filter(i => i.status !== 'pending').length;
      const progress = Math.round((completedCount / items.length) * 100);
      onSave({ ...area, items, progress, lastInspected: new Date().toISOString().split('T')[0] });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const statusColors: Record<Status, string> = {
    pending: 'bg-slate-100 border-slate-300 text-slate-400',
    good: 'bg-green-50 border-green-200 text-green-700',
    fair: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    poor: 'bg-red-50 border-red-200 text-red-700',
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <button onClick={onCancel} className="text-slate-400 hover:text-slate-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-800">{area.name}</h2>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Paso {currentIndex + 1} de {items.length}</p>
        </div>
        <div className="w-6" /> {/* Spacer */}
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden mb-8">
        <div className="h-2 bg-slate-100">
          <div 
            className="h-full bg-blue-500 transition-all duration-300" 
            style={{ width: `${((currentIndex + 1) / items.length) * 100}%` }}
          />
        </div>

        <div className="p-8">
          <div className="mb-8">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2 block">Evaluando:</label>
            <h3 className="text-2xl font-bold text-slate-800">{currentItem.label}</h3>
          </div>

          <div className="grid grid-cols-1 gap-4 mb-8">
            <button 
              onClick={() => updateStatus('good')}
              className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all ${currentItem.status === 'good' ? 'border-green-500 bg-green-50 ring-4 ring-green-100' : 'border-slate-100 hover:border-green-200'}`}
            >
              <div className="bg-green-500 text-white p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-bold text-slate-800">Óptimo</p>
                <p className="text-sm text-slate-500">Todo funciona correctamente</p>
              </div>
            </button>

            <button 
              onClick={() => updateStatus('fair')}
              className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all ${currentItem.status === 'fair' ? 'border-yellow-500 bg-yellow-50 ring-4 ring-yellow-100' : 'border-slate-100 hover:border-yellow-200'}`}
            >
              <div className="bg-yellow-500 text-white p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-bold text-slate-800">Regular</p>
                <p className="text-sm text-slate-500">Funciona con detalles a corregir</p>
              </div>
            </button>

            <button 
              onClick={() => updateStatus('poor')}
              className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all ${currentItem.status === 'poor' ? 'border-red-500 bg-red-50 ring-4 ring-red-100' : 'border-slate-100 hover:border-red-200'}`}
            >
              <div className="bg-red-500 text-white p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-bold text-slate-800">Deficiente</p>
                <p className="text-sm text-slate-500">Requiere intervención inmediata</p>
              </div>
            </button>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-wider block">Notas Adicionales</label>
            <textarea
              value={currentItem.comment || ''}
              onChange={(e) => updateComment(e.target.value)}
              placeholder="Escriba aquí cualquier observación específica..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-800 min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4 sticky bottom-6 z-50">
        <button 
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="flex-1 bg-white border border-slate-200 text-slate-600 py-4 rounded-2xl font-bold shadow-lg hover:bg-slate-50 transition-colors disabled:opacity-30"
        >
          Anterior
        </button>
        <button 
          onClick={handleNext}
          disabled={currentItem.status === 'pending'}
          className={`flex-[2] py-4 rounded-2xl font-bold shadow-lg transition-all ${
            currentItem.status === 'pending' ? 'bg-slate-300 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {currentIndex === items.length - 1 ? 'Finalizar Relevamiento' : 'Siguiente Paso'}
        </button>
      </div>
    </div>
  );
};

export default InspectionFlow;
