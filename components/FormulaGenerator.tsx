
import React, { useState } from 'react';
import { gemini } from '../services/geminiService';
import { supabaseService } from '../services/supabaseService';
import { UserProfile } from '../types';

interface Props {
  onActionComplete: () => void;
  user: UserProfile;
}

const FormulaGenerator: React.FC<Props> = ({ onActionComplete, user }) => {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const output = await gemini.generateFormula(prompt);
      setResult(output);
      
      // Menggunakan supabaseService asli, bukan mock
      await supabaseService.addHistory({
        user_id: user.id,
        prompt: `Buat formula: ${prompt}`,
        response: output,
        type: 'generator'
      });
      onActionComplete();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="glass rounded-2xl p-6">
        <label className="block text-sm font-medium text-slate-300 mb-2">Jelaskan formula yang Anda butuhkan</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Contoh: Buat formula untuk menghitung rata-rata tertimbang penjualan..."
          className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-4 text-slate-100 placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none h-32 transition-all"
        />
        <button
          onClick={handleGenerate}
          disabled={loading || !prompt}
          className="mt-4 w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <i className="fa-solid fa-circle-notch fa-spin"></i>
          ) : (
            <i className="fa-solid fa-wand-magic-sparkles"></i>
          )}
          {loading ? 'Sedang Memproses...' : 'Buat Formula'}
        </button>
      </div>

      {result && (
        <div className="glass rounded-2xl p-6 border-indigo-500/30 animate-in zoom-in-95 duration-300">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Hasil Formula AI</h3>
            <button 
              onClick={() => navigator.clipboard.writeText(result)}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <i className="fa-solid fa-copy"></i> Salin Hasil
            </button>
          </div>
          <div className="bg-slate-950 rounded-xl p-5 border border-slate-800">
            <pre className="whitespace-pre-wrap font-mono text-sm text-indigo-300 overflow-x-auto leading-relaxed">
              {result}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormulaGenerator;
