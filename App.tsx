
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import AreaList from './components/AreaList';
import InspectionFlow from './components/InspectionFlow';
import Dashboard from './components/Dashboard';
import SpreadsheetView from './components/SpreadsheetView';
import { InspectionArea } from './types';
import { INITIAL_AREAS } from './constants';

const App: React.FC = () => {
  const [areas, setAreas] = useState<InspectionArea[]>(INITIAL_AREAS);
  const [activeTab, setActiveTab] = useState<'list' | 'dashboard' | 'spreadsheet'>('list');
  const [selectedArea, setSelectedArea] = useState<InspectionArea | null>(null);
  const [workspaceName] = useState('Sanatorio Central');
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar datos al iniciar con manejo de errores robusto
  useEffect(() => {
    const initData = () => {
      const hash = window.location.hash;
      if (hash && hash.length > 10) {
        try {
          // Usar una decodificación más segura para UTF-8 y Base64
          const base64 = hash.substring(1);
          const jsonString = decodeURIComponent(escape(window.atob(base64)));
          const decoded = JSON.parse(jsonString);
          if (Array.isArray(decoded)) {
            setAreas(decoded);
            console.log("Datos cargados desde URL con éxito.");
          }
        } catch (e) {
          console.warn("No se pudo cargar el estado desde la URL (formato inválido). Cargando LocalStorage...");
        }
      } else {
        const saved = localStorage.getItem('hospitcheck_data');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) setAreas(parsed);
          } catch (e) {
            console.error("Error al leer datos guardados localmente.");
          }
        }
      }
      setIsLoaded(true);
    };

    initData();
  }, []);

  // Sincronizar URL y LocalStorage en cada cambio
  useEffect(() => {
    if (isLoaded) {
      try {
        const jsonString = JSON.stringify(areas);
        localStorage.setItem('hospitcheck_data', jsonString);
        
        // Generar hash Base64 seguro para la URL
        const base64 = window.btoa(unescape(encodeURIComponent(jsonString)));
        // Solo actualizar si el hash cambió para evitar loops
        if (window.location.hash !== `#${base64}`) {
          window.history.replaceState(null, "", `#${base64}`);
        }
      } catch (e) {
        console.error("Error al sincronizar estado:", e);
      }
    }
  }, [areas, isLoaded]);

  const handleSaveInspection = (updatedArea: InspectionArea) => {
    setAreas(prev => prev.map(a => a.id === updatedArea.id ? updatedArea : a));
    setSelectedArea(null);
  };

  const resetData = () => {
    if (confirm('¿Deseas borrar todo el progreso? Esta acción no se puede deshacer.')) {
      setAreas(INITIAL_AREAS);
      localStorage.removeItem('hospitcheck_data');
      window.location.hash = "";
    }
  };

  const copyPermanentLink = () => {
    try {
      const url = window.location.href;
      navigator.clipboard.writeText(url).then(() => {
        alert('¡Link permanente copiado! Este link contiene todos los datos actuales del relevamiento. Puedes guardarlo o enviarlo.');
      }).catch(() => {
        // Fallback para navegadores antiguos o sin permisos
        const input = document.createElement('input');
        input.value = url;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        alert('Link copiado al portapapeles.');
      });
    } catch (err) {
      console.error("Error al copiar link:", err);
    }
  };

  return (
    <Layout 
      title={workspaceName} 
      onShare={copyPermanentLink}
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex bg-slate-200/50 p-1 rounded-xl w-fit overflow-x-auto max-w-full">
              <button 
                onClick={() => setActiveTab('list')}
                className={`px-6 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${activeTab === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Relevamiento
              </button>
              <button 
                onClick={() => setActiveTab('spreadsheet')}
                className={`px-6 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${activeTab === 'spreadsheet' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Planilla / Excel
              </button>
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`px-6 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${activeTab === 'dashboard' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Reporte IA
              </button>
            </div>
            
            <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">Auto-Guardado Activo</span>
            </div>
          </div>

          {activeTab === 'list' && (
            <AreaList areas={areas} onSelect={(area) => setSelectedArea(area)} />
          )}
          {activeTab === 'spreadsheet' && (
            <SpreadsheetView areas={areas} onReset={resetData} onShare={copyPermanentLink} />
          )}
          {activeTab === 'dashboard' && (
            <Dashboard areas={areas} />
          )}
        </div>
      )}

      {!selectedArea && (
        <div className="fixed bottom-6 right-6 flex flex-col items-end gap-3 z-50">
           <button 
            className="bg-white text-slate-600 border border-slate-200 p-4 rounded-full shadow-xl hover:bg-slate-50 hover:scale-110 active:scale-95 transition-all flex items-center justify-center gap-2"
            onClick={copyPermanentLink}
            title="Copiar Link de Compartir"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-full shadow-2xl flex items-center justify-center gap-3 transition-transform hover:scale-105 active:scale-95"
            onClick={() => {
              const pending = areas.find(a => a.progress < 100);
              if (pending) setSelectedArea(pending);
              else alert('¡Todas las áreas han sido relevadas!');
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
            </svg>
            Nueva Inspección
          </button>
        </div>
      )}
    </Layout>
  );
};

export default App;
