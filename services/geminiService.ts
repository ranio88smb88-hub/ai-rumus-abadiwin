
import { GoogleGenAI } from "@google/genai";

// Pastikan akses process.env aman saat build time
const getApiKey = () => {
  try {
    return process.env.API_KEY || "";
  } catch {
    return "";
  }
};

const fastModel = 'gemini-3-flash-preview';
const proModel = 'gemini-3-pro-preview';

async function callModel(model: string, prompt: string, temperature: number = 0.5): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey) {
    return "API_KEY belum dikonfigurasi di Environment Variables Vercel.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: { 
        temperature,
        topP: 0.95,
        topK: 64
      }
    });
    
    return response.text || "Model tidak mengembalikan teks.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return `Gangguan Koneksi AI: ${error.message || "Gagal mendapatkan respon."}`;
  }
}

// Export sebagai objek konstan agar terdeteksi dengan benar oleh pembungkus (bundler)
export const gemini = {
  async generateFormula(context: string): Promise<string> {
    const prompt = `Anda adalah pakar formula Excel dan Google Sheets. Buat formula optimal untuk: ${context}. Berikan Formula, Logika, dan Catatan.`;
    return callModel(fastModel, prompt, 0.2);
  },

  async checkErrors(formula: string, context: string): Promise<string> {
    const prompt = `Audit formula berikut: ${formula}. Konteks: ${context}. Berikan Status, Temuan, dan Perbaikan.`;
    return callModel(proModel, prompt, 0.1);
  },

  async generateIdeas(objective: string): Promise<string> {
    const prompt = `Berikan desain arsitektur data spreadsheet untuk: ${objective}.`;
    return callModel(proModel, prompt, 0.7);
  },

  async analyzeSheetFormulas(data: string): Promise<string> {
    const prompt = `Lakukan analisis metadata sheet berikut: ${data}.`;
    return callModel(proModel, prompt, 0.3);
  }
};
