
import React, { useState } from 'react';
import { gemini } from '../services/geminiService';
import { supabaseService } from '../services/supabaseService';
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
      await supabaseService.addHistory({
        user_id: user.id,
        prompt: `Cek formula: ${formula}`,
        response: output,
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
      <div className="glass rounded-2xl p-6 flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Tempel Formula</label>
          <input
            type="text"
            value={formula}
            onChange={(e) => setFormula(e.target.value)}
            placeholder="=VLOOKUP(A2, B2:C10, 5, 0)"
            className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-3 text-indigo-300 font-mono text-sm outline-none focus:ring-2 focus:ring-rose-500 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Konteks (Opsional)</label>
          <textarea
            value={dataSample}
            onChange={(e) => setDataSample(e.target.value)}
            placeholder="Misal: Saya ingin mengambil data dari kolom ke-2 tapi muncul #REF!"
            className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-4 text-slate-100 h-24 outline-none focus:ring-2 focus:ring-rose-500 transition-all"
          />
        </div>
        <button
          onClick={handleCheck}
          disabled={loading || !formula}
          className="bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
        >
          {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-bug-slash"></i>}
          {loading ? 'Menganalisis...' : 'Audit Formula'}
        </button>
      </div>

      {result && (
        <div className="glass rounded-2xl p-6 border-rose-500/30 animate-in zoom-in-95">
          <h3 className="text-lg font-bold text-white mb-4">Temuan Audit</h3>
          <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 font-mono text-sm text-slate-300 whitespace-pre-wrap">
            {result}
          </div>
        </div>
      )}
    </div>
  );
};

export default ErrorChecker;
