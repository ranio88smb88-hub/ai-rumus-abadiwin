
import React, { useState } from 'react';
import { gemini } from '../services/geminiService';
import { supabaseService } from '../services/supabaseService';
import { UserProfile } from '../types';

interface Props {
  user: UserProfile;
}

declare global {
  interface Window {
    google: any;
  }
}

const GoogleSheetsAnalyzer: React.FC<Props> = ({ user }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState('');
  const [step, setStep] = useState(0); 
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const extractId = (link: string) => {
    const match = link.match(/\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : null;
  };

  const handleGoogleAuth = () => {
    if (!window.google) {
      alert("Library Google belum siap. Tunggu sebentar atau refresh halaman.");
      return;
    }

    const clientId = process.env.GOOGLE_CLIENT_ID || '';

    if (!clientId) {
      alert("Google Client ID belum dikonfigurasi di variabel lingkungan.");
      return;
    }

    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId, 
      scope: 'https://www.googleapis.com/auth/spreadsheets.readonly',
      callback: (response: any) => {
        if (response.access_token) {
          setAccessToken(response.access_token);
          performRealAnalysis(response.access_token);
        }
      },
    });
    client.requestAccessToken();
  };

  const performRealAnalysis = async (token: string) => {
    const spreadsheetId = extractId(url);
    if (!spreadsheetId) return;

    setLoading(true);
    setStep(1);

    try {
      const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=properties.title,sheets.properties.title`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error('Gagal mengambil data. Pastikan link benar.');
      
      const data = await response.json();
      const sheetNames = data.sheets.map((s: any) => s.properties.title).join(', ');
      
      const context = `Lakukan audit arsitektur untuk dokumen: ${data.properties.title}. Tab: [${sheetNames}]. Berikan saran optimasi.`;
      const result = await gemini.analyzeSheetFormulas(context);
      
      setAnalysis(result);
      setStep(2);
      
      await supabaseService.addHistory({
        user_id: user.id,
        prompt: `Audit Arsitektur: ${data.properties.title}`,
        response: result,
        type: 'sheet-analysis'
      });
    } catch (err: any) {
      alert(`Error: ${err.message}`);
      setStep(0);
    } finally {
      setLoading(false);
    }
  };

  const startProcess = () => {
    if (!url.trim()) return;
    const spreadsheetId = extractId(url);
    if (!spreadsheetId) {
      alert('Tautan tidak valid!');
      return;
    }
    
    if (accessToken) {
      performRealAnalysis(accessToken);
    } else {
      handleGoogleAuth();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="glass rounded-3xl p-10 border border-slate-800 shadow-xl overflow-hidden relative">
        <div className="absolute top-6 right-6 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full">
          <i className="fa-solid fa-shield-check text-emerald-500 text-xs"></i>
          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Protected Session</span>
        </div>

        {step === 0 && (
          <div className="text-center pt-4">
            <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">Enterprise Sheet Auditor</h3>
            <p className="text-slate-400 max-w-xl mx-auto mb-8 leading-relaxed">
              Analisis struktur Google Sheets Anda secara aman menggunakan audit metadata AI.
            </p>
            
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Tempel link Google Sheets Anda..."
                className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl pl-6 pr-44 py-5 text-slate-100 placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <button
                onClick={startProcess}
                disabled={loading || !url}
                className="absolute right-2 top-2 bottom-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold px-8 rounded-xl transition-all"
              >
                {loading ? 'Processing...' : 'Audit Aman'}
              </button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="text-center py-20 animate-pulse">
            <i className="fa-solid fa-spinner fa-spin text-4xl text-indigo-500 mb-6"></i>
            <h4 className="text-2xl font-bold text-white">Menganalisis Metadata...</h4>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-in zoom-in-95 duration-500">
            <div className="flex justify-between items-center border-b border-slate-800 pb-8">
              <h3 className="text-2xl font-bold text-white tracking-tight">Hasil Audit</h3>
              <button onClick={() => setStep(0)} className="text-slate-400 hover:text-white text-xs font-bold uppercase">Tutup</button>
            </div>
            <div className="bg-slate-950/80 rounded-2xl p-8 border border-slate-800 font-mono text-sm leading-relaxed text-slate-300 whitespace-pre-wrap">
              {analysis}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleSheetsAnalyzer;
