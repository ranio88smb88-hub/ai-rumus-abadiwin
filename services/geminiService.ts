import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  private ai: GoogleGenAI | null = null;
  // Menggunakan Gemini 3 sesuai standar instruksi terbaru
  private fastModel = 'gemini-3-flash-preview'; 
  private proModel = 'gemini-3-pro-preview';

  constructor() {
    // API_KEY diperoleh eksklusif dari environment variable process.env.API_KEY
    const apiKey = process.env.API_KEY;
    if (apiKey) {
      this.ai = new GoogleGenAI({ apiKey });
    } else {
      console.warn("WARNING: API_KEY tidak terdeteksi. Pastikan variabel lingkungan sudah diatur di Vercel.");
    }
  }

  private async callModel(model: string, prompt: string, temperature: number = 0.5): Promise<string> {
    if (!this.ai) {
      return "Sistem AI belum terkonfigurasi. Silakan periksa API_KEY di panel kontrol Vercel.";
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
      
      const text = response.text;
      if (!text) throw new Error("Model tidak mengembalikan teks.");
      
      return text;
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      
      if (error.message?.includes("429")) {
        return "Eror: Kuota API terlampaui (Rate Limit). Silakan coba lagi beberapa saat lagi.";
      }
      if (error.message?.includes("403")) {
        return "Eror: API Key tidak valid atau region Anda tidak didukung oleh Google Gemini.";
      }
      if (error.message?.includes("500")) {
        return "Eror: Server Google sedang mengalami gangguan. Silakan coba lagi nanti.";
      }
      
      return `Gangguan Koneksi AI: ${error.message || "Gagal mendapatkan respon dari server."}`;
    }
  }

  async generateFormula(context: string): Promise<string> {
    const prompt = `Anda adalah pakar formula Excel dan Google Sheets paling senior.
      Buatlah formula yang optimal untuk kasus berikut: ${context}
      
      Berikan respon dalam format:
      - Formula: (Tulis formula saja)
      - Logika: (Jelaskan cara kerjanya)
      - Catatan: (Tips performa)`;
    
    return this.callModel(this.fastModel, prompt, 0.2);
  }

  async checkErrors(formula: string, context: string): Promise<string> {
    const prompt = `Audit formula spreadsheet berikut untuk menemukan kesalahan sintaks, referensi, atau logika.
      Formula: ${formula}
      Konteks Data: ${context}
      
      Format Output:
      1. Status: [Valid/Eror]
      2. Temuan: [Detail masalah]
      3. Perbaikan: [Formula yang sudah benar]`;
    
    return this.callModel(this.proModel, prompt, 0.1);
  }

  async generateIdeas(objective: string): Promise<string> {
    const prompt = `Berikan desain arsitektur data spreadsheet profesional untuk tujuan: ${objective}.
      Berikan saran mengenai Struktur Tabel, Hubungan Antar Sheet, dan Otomatisasi Script yang diperlukan.`;
    
    return this.callModel(this.proModel, prompt, 0.7);
  }

  async analyzeSheetFormulas(data: string): Promise<string> {
    const prompt = `Lakukan analisis mendalam terhadap struktur data dan formula berikut:
      ${data}
      
      Identifikasi kemacetan performa (performance bottleneck) dan berikan skor optimasi (0-100).`;
    
    return this.callModel(this.proModel, prompt, 0.3);
  }
}

export const gemini = new GeminiService();
