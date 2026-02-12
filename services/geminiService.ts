
import { GoogleGenAI } from "@google/genai";

// Fungsi pembantu untuk mendapatkan API Key secara aman di lingkungan build manapun
const getSafeApiKey = () => {
  try {
    // Mencoba akses process.env (Vercel/Node) atau fallback ke string kosong
    return (typeof process !== 'undefined' ? process.env.API_KEY : '') || "";
  } catch {
    return "";
  }
};

const FAST_MODEL = 'gemini-3-flash-preview';
const PRO_MODEL = 'gemini-3-pro-preview';

async function executeAI(modelName: string, prompt: string, temp: number = 0.5): Promise<string> {
  const key = getSafeApiKey();
  if (!key) return "Error: API_KEY tidak ditemukan di environment variables.";

  try {
    const aiClient = new GoogleGenAI({ apiKey: key });
    const response = await aiClient.models.generateContent({
      model: modelName,
      contents: prompt,
      config: { temperature: temp }
    });
    return response.text || "AI tidak memberikan respon.";
  } catch (err: any) {
    console.error("Gemini Error:", err);
    return `Koneksi AI Terputus: ${err.message}`;
  }
}

// Definisikan objek secara eksplisit sebelum diekspor
const geminiInstance = {
  generateFormula: (ctx: string) => 
    executeAI(FAST_MODEL, `Pakar Excel: Buat formula untuk ${ctx}. Berikan: Formula, Logika, Catatan.`, 0.2),
  
  checkErrors: (formula: string, ctx: string) => 
    executeAI(PRO_MODEL, `Audit: ${formula}. Konteks: ${ctx}. Berikan: Status, Temuan, Perbaikan.`, 0.1),
  
  generateIdeas: (obj: string) => 
    executeAI(PRO_MODEL, `Arsitek Data: Rancang struktur sheet untuk ${obj}.`, 0.7),
  
  analyzeSheetFormulas: (data: string) => 
    executeAI(PRO_MODEL, `Analisis Metadata: ${data}.`, 0.3)
};

// Export sebagai named export 'gemini'
export const gemini = geminiInstance;
