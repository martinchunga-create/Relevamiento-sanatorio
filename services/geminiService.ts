
import { GoogleGenAI } from "@google/genai";
import { InspectionArea } from "../types";

/**
 * Expert analysis service using Gemini AI to provide insights on hospital maintenance.
 */
export const getInspectionInsights = async (areas: InspectionArea[]) => {
  // Use the API key directly from environment as required
  if (!process.env.API_KEY) {
    return "Error: No se ha configurado la API KEY necesaria para el análisis de IA.";
  }

  // Initialize the Google GenAI client with named parameter
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const completedAreas = areas.filter(a => a.progress > 0);
  
  if (completedAreas.length === 0) {
    return "No hay áreas relevadas aún para analizar. Complete al menos una habitación para obtener un diagnóstico.";
  }

  // Serialize inspection data safely before including it in the prompt to avoid parsing issues
  const inspectionData = JSON.stringify(completedAreas.map(a => ({
    name: a.name,
    progress: a.progress,
    items: a.items.filter(i => i.status !== 'good' && i.status !== 'pending')
  }))).substring(0, 4000);

  // Construct the prompt carefully as a template literal
  const prompt = `Actúa como un experto en gestión hospitalaria y mantenimiento edilicio. 
  He realizado un relevamiento de las siguientes áreas: ${inspectionData}. 
  Analiza los comentarios y estados 'poor' o 'fair'. 
  Proporciona un resumen ejecutivo dinámico, identifica los 3 problemas más críticos y sugiere un plan de acción inmediato.
  La respuesta debe ser clara, profesional y en español.`;

  try {
    // Generate content using the recommended model for text tasks
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    // Access the text output via the .text property (not a method)
    return response.text || "No se ha podido generar el informe de diagnóstico.";
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Hubo un problema al conectar con el servicio de IA. Verifique su conexión o intente más tarde.";
  }
};
