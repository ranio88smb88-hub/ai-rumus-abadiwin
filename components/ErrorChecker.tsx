
import React, { useState } from 'react';
import { gemini } from '../services/geminiService';
import { mockSupabase } from '../services/mockSupabase';
import { UserProfile } from '../types';

interface Props {
  onActionComplete: () => void;
  user: UserProfile;
}

const ErrorChecker: React.FC<Props> = ({ onActionComplete, user }) => {
  const [formula, setFormula] = useState('');
  const [dataSample, setDataSample] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (!formula.trim()) return;
    setLoading(true);
    try {
      const output = await gemini.checkErrors(formula, dataSample);
      setResult(output);
      await mockSupabase.addHistory({
        user_id: user.id,
        prompt: `Cek formula: ${formula} dengan konteks: ${dataSample}`,
        response: output,
        // Fixed: Use 'error' instead of 'checker' to match AIRequestType
        type: 'error'
      });
      onActionComplete();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-slate-300 mb-2">Tempel Formula Anda</label>
          <input
            type="text"
            value={formula}
            onChange={(e) => setFormula(e.target.value)}
            placeholder="=SUMIFS(B2:B10, A2:A10, '>100')..."
            className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-3 text-slate-100 font-mono text-sm placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-slate-300 mb-2">Sampel Data / Konteks Kesalahan (Opsional)</label>
          <textarea
            value={dataSample}
            onChange={(e) => setDataSample(e.target.value)}
            placeholder="A2: Tanggal, B2: Harga. Saya mendapatkan error #VALUE!..."
            className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-4 text-slate-100 placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none h-24 transition-all"
          />
        </div>
        <button
          onClick={handleCheck}
          disabled={loading || !formula}
          className="col-span-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <i className="fa-solid fa-circle-notch fa-spin"></i>
          ) : (
            <i className="fa-solid fa-magnifying-glass-chart"></i>
          )}
          {loading ? 'Menganalisis...' : 'Analisis Kesalahan'}
        </button>
      </div>

      {result && (
        <div className="glass rounded-2xl p-6 border-indigo-500/30 animate-in zoom-in-95">
          <h3 className="text-lg font-semibold text-white mb-4">Laporan Audit Formula</h3>
          <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap bg-slate-950 p-6 rounded-xl border border-slate-800 font-mono text-sm">
            {result}
          </div>
        </div>
      )}
    </div>
  );
};

export default ErrorChecker;
