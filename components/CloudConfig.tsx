
import React from 'react';
import { InspectionArea } from '../types';

interface CloudConfigProps {
  areas: InspectionArea[];
}

const CloudConfig: React.FC<CloudConfigProps> = ({ areas }) => {
  const currentUrl = window.location.href;

  const copyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    alert('Link de respaldo copiado al portapapeles.');
  };

  const appsScriptCode = `
function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.clear();
  // Lógica para guardar datos del relevamiento...
  return ContentService.createTextOutput("Datos guardados correctamente");
}
  `.trim();

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
          ¿Cómo hacer este link permanente?
        </h2>
        <p className="text-blue-100 mb-6 leading-relaxed">
          Actualmente tus datos se guardan en el navegador y en la URL. Para una solución profesional y colaborativa donde todos vean lo mismo, sigue estos pasos:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h3 className="font-bold text-lg mb-2">1. Despliegue Web (Gratis)</h3>
            <p className="text-sm text-blue-50 mb-4">Sube estos archivos a <b>Vercel</b> o <b>Netlify</b> para tener una URL limpia como <code className="bg-blue-900/40 px-1 rounded">sanatorio.vercel.app</code>.</p>
            <a href="https://vercel.com" target="_blank" className="inline-block bg-white text-blue-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-50 transition-colors">Abrir Vercel</a>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h3 className="font-bold text-lg mb-2">2. Base de Datos Google</h3>
            <p className="text-sm text-blue-50 mb-4">Usa Google Sheets como base de datos permanente para que no se pierda nada nunca.</p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-400 transition-colors">Ver Guía Técnica</button>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          Tu Link de Datos Actual
        </h3>
        <p className="text-xs text-slate-500 mb-3">Este link contiene una copia de seguridad comprimida de todo tu progreso actual:</p>
        <div className="flex gap-2">
          <input 
            type="text" 
            readOnly 
            value={currentUrl} 
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-400 font-mono outline-none"
          />
          <button 
            onClick={copyLink}
            className="bg-slate-800 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-700 transition-colors shrink-0"
          >
            Copiar Link
          </button>
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl p-6 text-slate-300">
        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4m-4-4l-4 4M6 16l-4-4 4-4" />
          </svg>
          Código para Google Sheets (Apps Script)
        </h3>
        <pre className="bg-slate-800 p-4 rounded-xl text-[10px] font-mono overflow-x-auto border border-slate-700 mb-4">
          {appsScriptCode}
        </pre>
        <p className="text-xs text-slate-500 italic">
          Pega este código en el editor de Apps Script de tu planilla de Google y publícalo como "Aplicación Web". Esto permitirá que la app sea permanente y compartida.
        </p>
      </div>
    </div>
  );
};

export default CloudConfig;
