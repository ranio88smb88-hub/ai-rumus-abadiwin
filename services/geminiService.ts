
import { GoogleGenAI } from "@google/genai";

// Pastikan API_KEY tersedia. Jika di Vercel, pastikan sudah diisi di Environment Variables.
const API_KEY = process.env.API_KEY || "";

class GeminiService {
  private ai: GoogleGenAI | null = null;
  private fastModel = 'gemini-3-flash-preview'; 
  private proModel = 'gemini-3-pro-preview';

  constructor() {
    if (API_KEY) {
      this.ai = new GoogleGenAI({ apiKey: API_KEY });
    }
  }

  private async callModel(model: string, prompt: string, temperature: number = 0.5): Promise<string> {
    if (!this.ai) {
      return "Sistem AI belum terkonfigurasi. Periksa API_KEY di Dashboard Vercel.";
    }

    try {
      const response = await this.ai.models.generateContent({
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

  async generateFormula(context: string): Promise<string> {
    const prompt = `Anda adalah pakar formula Excel dan Google Sheets. Buat formula optimal untuk: ${context}. Berikan Formula, Logika, dan Catatan.`;
    return this.callModel(this.fastModel, prompt, 0.2);
  }

  async checkErrors(formula: string, context: string): Promise<string> {
    const prompt = `Audit formula berikut: ${formula}. Konteks: ${context}. Berikan Status, Temuan, dan Perbaikan.`;
    return this.callModel(this.proModel, prompt, 0.1);
  }

  async generateIdeas(objective: string): Promise<string> {
    const prompt = `Berikan desain arsitektur data spreadsheet untuk: ${objective}.`;
    return this.callModel(this.proModel, prompt, 0.7);
  }

  async analyzeSheetFormulas(data: string): Promise<string> {
    const prompt = `Lakukan analisis metadata sheet berikut: ${data}.`;
    return this.callModel(this.proModel, prompt, 0.3);
  }
}

// Gunakan named export yang jelas dan inisialisasi langsung
export const gemini = new GeminiService();
