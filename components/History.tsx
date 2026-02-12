
import React, { useState } from 'react';
import { AIHistoryItem, UserProfile } from '../types';
import { mockSupabase } from '../services/mockSupabase';

interface Props {
  history: AIHistoryItem[];
  setHistory: React.Dispatch<React.SetStateAction<AIHistoryItem[]>>;
  user: UserProfile;
  tableStyle?: 'glass' | 'solid' | 'minimal';
}

const History: React.FC<Props> = ({ history, setHistory, user, tableStyle = 'glass' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.prompt.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.response.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleDelete = async (id: string) => {
    await mockSupabase.deleteHistory(id);
    setHistory(prev => prev.filter(h => h.id !== id));
  };

  const getTypeLabel = (type: string) => {
    switch(type) {
      case 'generator': return 'Formula';
      case 'error': return 'Audit';
      case 'idea': return 'Idea';
      case 'sheet-analysis': return 'Sheet';
      default: return 'Misc';
    }
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'generator': return 'text-indigo-400 bg-indigo-400/10';
      case 'error': return 'text-rose-400 bg-rose-400/10';
      case 'idea': return 'text-amber-400 bg-amber-400/10';
      case 'sheet-analysis': return 'text-emerald-400 bg-emerald-400/10';
      default: return 'text-slate-400 bg-slate-400/10';
    }
  };

  const itemClass = tableStyle === 'glass' 
    ? "glass p-6 rounded-2xl group relative" 
    : tableStyle === 'solid'
    ? "bg-slate-900 p-6 rounded-lg border-2 border-slate-800 group relative"
    : "border-b border-slate-800 py-6 group relative";

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>
          <input
            type="text"
            placeholder="Search history..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-300 outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Types</option>
          <option value="generator">Formula</option>
          <option value="error">Audit</option>
          <option value="idea">Idea</option>
          <option value="sheet-analysis">Analysis</option>
        </select>
      </div>

      <div className="space-y-4">
        {filteredHistory.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/30 rounded-2xl border border-slate-800 border-dashed">
            <i className="fa-solid fa-box-open text-4xl text-slate-700 mb-4"></i>
            <p className="text-slate-500">No activity logs found.</p>
          </div>
        ) : (
          filteredHistory.map((item) => (
            <div key={item.id} className={itemClass}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <span className={`text-[9px] uppercase font-black px-2 py-1 rounded tracking-tighter ${getTypeColor(item.type)}`}>
                    {getTypeLabel(item.type)}
                  </span>
                  <span className="text-[10px] text-slate-600 font-bold uppercase">
                    {new Date(item.created_at).toLocaleDateString()} • {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="text-slate-600 hover:text-rose-400 transition-colors"
                >
                  <i className="fa-solid fa-trash-can text-sm"></i>
                </button>
              </div>
              <div className="space-y-4">
                <p className="text-slate-400 text-sm italic font-light">"{item.prompt}"</p>
                <div className="bg-black/20 p-4 rounded-xl border border-white/5 font-mono text-xs text-indigo-300 overflow-x-auto whitespace-pre-wrap">
                  {item.response}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default History;
