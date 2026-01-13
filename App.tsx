
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import AreaList from './components/AreaList';
import InspectionFlow from './components/InspectionFlow';
import Dashboard from './components/Dashboard';
import SpreadsheetView from './components/SpreadsheetView';
import CloudConfig from './components/CloudConfig';
import { InspectionArea } from './types';
import { INITIAL_AREAS } from './constants';

type Tab = 'list' | 'dashboard' | 'spreadsheet' | 'cloud';

const App: React.FC = () => {
  const [areas, setAreas] = useState<InspectionArea[]>(INITIAL_AREAS);
  const [activeTab, setActiveTab] = useState<Tab>('list');
  const [selectedArea, setSelectedArea] = useState<InspectionArea | null>(null);
  const [workspaceName] = useState('Sanatorio Central');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const initData = () => {
      const hash = window.location.hash;
      if (hash && hash.length > 10) {
        try {
          const base64 = hash.substring(1);
          const jsonString = decodeURIComponent(escape(window.atob(base64)));
          const decoded = JSON.parse(jsonString);
          if (Array.isArray(decoded)) {
            setAreas(decoded);
          }
        } catch (e) {
          console.warn("Error decodificando URL.");
        }
      } else {
        const saved = localStorage.getItem('hospitcheck_data');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) setAreas(parsed);
          } catch (e) {}
        }
      }
      setIsLoaded(true);
    };
    initData();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      const jsonString = JSON.stringify(areas);
      localStorage.setItem('hospitcheck_data', jsonString);
      const base64 = window.btoa(unescape(encodeURIComponent(jsonString)));
      if (window.location.hash !== `#${base64}` && base64.length < 8000) {
        window.history.replaceState(null, "", `#${base64}`);
      }
    }
  }, [areas, isLoaded]);

  const handleSaveInspection = (updatedArea: InspectionArea) => {
    setAreas(prev => prev.map(a => a.id === updatedArea.id ? updatedArea : a));
    setSelectedArea(null);
  };

  const resetData = () => {
    if (confirm('¿Deseas borrar todo el progreso?')) {
      setAreas(INITIAL_AREAS);
      localStorage.removeItem('hospitcheck_data');
      window.location.hash = "";
    }
  };

  return (
    <Layout 
      title={workspaceName} 
      onReset={resetData}
    >
      {selectedArea ? (
        <InspectionFlow 
          area={selectedArea} 
          onSave={handleSaveInspection}
          onCancel={() => setSelectedArea(null)}
        />
      ) : (
        <div className="space-y-8">
          <div className="flex bg-slate-200/50 p-1 rounded-xl w-fit overflow-x-auto max-w-full no-scrollbar">
            <button 
              onClick={() => setActiveTab('list')}
              className={`px-4 sm:px-6 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${activeTab === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Relevamiento
            </button>
            <button 
              onClick={() => setActiveTab('spreadsheet')}
              className={`px-4 sm:px-6 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${activeTab === 'spreadsheet' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Planilla
            </button>
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 sm:px-6 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${activeTab === 'dashboard' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Reporte IA
            </button>
            <button 
              onClick={() => setActiveTab('cloud')}
              className={`px-4 sm:px-6 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${activeTab === 'cloud' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              ☁️ Nube & Link
            </button>
          </div>

          {activeTab === 'list' && <AreaList areas={areas} onSelect={(area) => setSelectedArea(area)} />}
          {activeTab === 'spreadsheet' && <SpreadsheetView areas={areas} />}
          {activeTab === 'dashboard' && <Dashboard areas={areas} />}
          {activeTab === 'cloud' && <CloudConfig areas={areas} />}
        </div>
      )}

      {!selectedArea && (
        <div className="fixed bottom-6 right-6 z-50">
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-full shadow-2xl flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95"
            onClick={() => {
              const pending = areas.find(a => a.progress < 100);
              if (pending) setSelectedArea(pending);
              else alert('¡Relevamiento completado!');
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
            </svg>
            Continuar Relevamiento
          </button>
        </div>
      )}
    </Layout>
  );
};

export default App;
