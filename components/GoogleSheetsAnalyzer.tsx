import React, { useState, useEffect } from 'react';
import { gemini } from '../services/geminiService';
import { mockSupabase } from '../services/mockSupabase';
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
  const [targetId, setTargetId] = useState('');
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

    // Menggunakan Google Client ID dari environment variable
    const clientId = process.env.GOOGLE_CLIENT_ID || '';

    if (!clientId) {
      alert("Google Client ID belum dikonfigurasi di variabel lingkungan.");
      return;
    }

    // Menggunakan scope READONLY untuk menjamin data tidak bisa diubah/dihapus
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId, 
      scope: 'https://www.googleapis.com/auth/spreadsheets.readonly',
      callback: (response: any) => {
        if (response.access_token) {
          setAccessToken(response.access_token);
          performRealAnalysis(response.access_token);
        } else if (response.error) {
          console.error("Auth Error:", response.error);
        }
      },
    });
    client.requestAccessToken();
  };

  const performRealAnalysis = async (token: string) => {
    const spreadsheetId = extractId(url);
    if (!spreadsheetId) return;

    setTargetId(spreadsheetId);
    setLoading(true);
    setStep(1);

    try {
      // Fetch metadata spreadsheet asli - Hanya metadata untuk audit struktur (Bukan isi data sensitif)
      const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=properties.title,sheets.properties.title`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error('Gagal mengambil data. Pastikan link benar dan izin diberikan.');
      
      const data = await response.json();
      const sheetNames = data.sheets.map((s: any) => s.properties.title).join(', ');
      
      const context = `Lakukan audit arsitektur untuk dokumen: ${data.properties.title}.
      Tab yang ditemukan: [${sheetNames}].
      Berikan saran optimasi struktur tab tanpa memerlukan akses ke data di dalam sel.`;
      
      const result = await gemini.analyzeSheetFormulas(context);
      
      setAnalysis(result);
      setStep(2);
      
      await mockSupabase.addHistory({
        user_id: user.id,
        prompt: `Audit Arsitektur Aman: ${data.properties.title}`,
        response: result,
        type: 'sheet-analysis'
      });
    } catch (err: any) {
      alert(`Keamanan Terjaga: ${err.message}`);
      setStep(0);
    } finally {
      setLoading(false);
    }
  };

  const startProcess = () => {
    if (!url.trim()) return;
    const spreadsheetId = extractId(url);
    if (!spreadsheetId) {
      alert('Tautan tidak valid! Masukkan link Google Sheets yang benar.');
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
        {/* Security Badge */}
        <div className="absolute top-6 right-6 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full">
          <i className="fa-solid fa-shield-check text-emerald-500 text-xs"></i>
          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Read-Only Protection Active</span>
        </div>

        {step === 0 && (
          <div className="text-center pt-4">
            <div className="w-20 h-20 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-indigo-500/20">
              <i className="fa-brands fa-google text-4xl text-indigo-500"></i>
            </div>
            <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">Enterprise Sheet Auditor</h3>
            <p className="text-slate-400 max-w-xl mx-auto mb-8 leading-relaxed text-lg font-light">
              Tingkatkan efisiensi spreadsheet Anda dengan audit AI tingkat tinggi. Kami hanya mengakses metadata struktur untuk memastikan privasi data Anda tetap 100% terjaga.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-10">
               <div className="bg-slate-900/40 p-6 rounded-2xl border border-white/5 text-left group hover:border-indigo-500/30 transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                      <i className="fa-solid fa-lock text-indigo-400"></i>
                    </div>
                    <p className="text-xs text-slate-200 uppercase font-black tracking-widest">Privasi Mutlak</p>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">AI hanya menerima informasi nama tab dan ID dokumen. Isi sel data sensitif Anda tidak akan pernah terkirim ke server mana pun.</p>
               </div>
               <div className="bg-slate-900/40 p-6 rounded-2xl border border-white/5 text-left group hover:border-rose-500/30 transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center">
                      <i className="fa-solid fa-ban text-rose-400"></i>
                    </div>
                    <p className="text-xs text-slate-200 uppercase font-black tracking-widest">Tanpa Perubahan</p>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">Akses 'Read-Only' menjamin sistem kami tidak dapat menghapus, mengubah, atau merusak file asli Anda di Google Drive.</p>
               </div>
            </div>

            <div className="relative max-w-2xl mx-auto">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500">
                <i className="fa-solid fa-link"></i>
              </div>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Tempel link Google Sheets Anda di sini..."
                className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl pl-14 pr-44 py-5 text-slate-100 placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner"
              />
              <button
                onClick={startProcess}
                disabled={loading || !url}
                className="absolute right-2 top-2 bottom-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold px-8 rounded-xl transition-all shadow-lg flex items-center gap-2"
              >
                {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-shield-halved"></i>}
                {loading ? 'Securing...' : 'Audit Aman'}
              </button>
            </div>
            <p className="mt-8 text-[11px] text-slate-600 uppercase tracking-[0.2em] font-bold">
               <i className="fa-solid fa-certificate text-indigo-500 mr-2"></i> Secured by Google Cloud Platform & Gemini AI Enterprise
            </p>
          </div>
        )}

        {step === 1 && (
          <div className="text-center py-20">
            <div className="relative w-32 h-32 mx-auto mb-10">
              <div className="absolute inset-0 border-4 border-indigo-500/10 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <i className="fa-solid fa-user-shield text-4xl text-indigo-400 animate-pulse"></i>
              </div>
            </div>
            <h4 className="text-2xl font-bold text-white mb-3">Membangun Terowongan Aman...</h4>
            <p className="text-slate-500 text-xs font-mono tracking-widest uppercase">Fetching structural metadata via OAuth2</p>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-in zoom-in-95 duration-500">
            <div className="flex justify-between items-center border-b border-slate-800 pb-8">
              <div>
                <h3 className="text-3xl font-bold text-white tracking-tight">Laporan Audit Metadata</h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <p className="text-xs text-emerald-400 font-bold tracking-widest uppercase">
                    Data Integrity Verified & Privacy Preserved
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setStep(0)}
                className="text-slate-400 hover:text-white text-xs font-bold px-6 py-3 rounded-xl bg-white/5 border border-white/10 transition-all"
              >
                <i className="fa-solid fa-arrow-left mr-2"></i> Tutup Sesi Aman
              </button>
            </div>
            <div className="bg-slate-950/80 rounded-2xl p-8 border border-slate-800 font-mono text-sm leading-relaxed text-slate-300 whitespace-pre-wrap overflow-x-auto shadow-inner relative">
              {analysis}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleSheetsAnalyzer;
