
import React, { useState } from 'react';
import { gemini } from '../services/geminiService';
import { mockSupabase } from '../services/mockSupabase';
import { UserProfile } from '../types';

interface Props {
  onActionComplete: () => void;
  user: UserProfile;
}

const IdeaGenerator: React.FC<Props> = ({ onActionComplete, user }) => {
  const [objective, setObjective] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!objective.trim()) return;
    setLoading(true);
    try {
      const output = await gemini.generateIdeas(objective);
      setResult(output);
      await mockSupabase.addHistory({
        user_id: user.id,
        prompt: `Buat ide arsitektur untuk: ${objective}`,
        response: output,
        // Fixed: Use 'idea' instead of 'ideas' to match AIRequestType
        type: 'idea'
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
      <div className="glass rounded-2xl p-6">
        <label className="block text-sm font-medium text-slate-300 mb-2">Apa yang ingin Anda bangun di Spreadsheet?</label>
        <textarea
          value={objective}
          onChange={(e) => setObjective(e.target.value)}
          placeholder="Contoh: Sistem manajemen inventaris otomatis dengan peringatan stok rendah dan pelacakan ROI..."
          className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-4 text-slate-100 placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none h-32 transition-all"
        />
        <button
          onClick={handleGenerate}
          disabled={loading || !objective}
          className="mt-4 w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <i className="fa-solid fa-circle-notch fa-spin"></i>
          ) : (
            <i className="fa-solid fa-lightbulb"></i>
          )}
          {loading ? 'Sedang Berpikir...' : 'Dapatkan Rekomendasi Arsitektur'}
        </button>
      </div>

      {result && (
        <div className="glass rounded-2xl p-6 border-indigo-500/30 animate-in zoom-in-95">
          <h3 className="text-lg font-semibold text-white mb-4">Saran Struktur & Otomatisasi</h3>
          <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 text-slate-300 whitespace-pre-wrap leading-relaxed">
            {result}
          </div>
        </div>
      )}
    </div>
  );
};

export default IdeaGenerator;
