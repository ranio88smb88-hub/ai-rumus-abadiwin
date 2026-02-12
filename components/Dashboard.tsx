
import React, { useState, useEffect } from 'react';
import { UserProfile, AIHistoryItem, AppearanceSettings } from '../types';
import Sidebar from './Sidebar';
import FormulaGenerator from './FormulaGenerator';
import ErrorChecker from './ErrorChecker';
import IdeaGenerator from './IdeaGenerator';
import GoogleSheetsAnalyzer from './GoogleSheetsAnalyzer';
import History from './History';
import AdminPanel from './AdminPanel';
import Settings from './Settings';
import { supabaseService } from '../services/supabaseService';

interface DashboardProps {
  user: UserProfile;
  onLogout: () => void;
  appearance: AppearanceSettings;
  updateAppearance: (settings: Partial<AppearanceSettings>) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, appearance, updateAppearance }) => {
  const [activeTab, setActiveTab] = useState('generator');
  const [history, setHistory] = useState<AIHistoryItem[]>([]);

  const fetchHistory = async () => {
    try {
      const data = await supabaseService.getHistory();
      setHistory(data);
    } catch (err) {
      console.error("Gagal memuat riwayat:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const tabTitles: Record<string, {title: string, desc: string}> = {
    generator: { title: 'Formula Generator', desc: 'Ubah instruksi teks menjadi formula Excel/Sheets yang kompleks.' },
    checker: { title: 'Error Auditor', desc: 'Temukan kesalahan logika dan sintaks dalam sekejap.' },
    ideas: { title: 'Architecture Ideas', desc: 'Rancang struktur data dan otomatisasi tingkat lanjut.' },
    analyzer: { title: 'Multi-Sheet Analyzer', desc: 'Audit mendalam untuk seluruh ekosistem spreadsheet Anda.' },
    history: { title: 'Activity Logs', desc: 'Telusuri kembali semua solusi AI yang pernah Anda buat.' },
    admin: { title: 'System Control', desc: 'Manajemen pengguna dan statistik penggunaan global.' },
    settings: { title: 'Personalization', desc: 'Sesuaikan banner, background, font, dan tema aplikasi.' }
  };

  const renderContent = () => {
    const transitionClass = "animate-in fade-in slide-in-from-bottom-4 duration-500";
    return (
      <div className={transitionClass}>
        {(() => {
          switch (activeTab) {
            case 'generator': return <FormulaGenerator onActionComplete={fetchHistory} user={user} />;
            case 'checker': return <ErrorChecker onActionComplete={fetchHistory} user={user} />;
            case 'ideas': return <IdeaGenerator onActionComplete={fetchHistory} user={user} />;
            case 'analyzer': return <GoogleSheetsAnalyzer user={user} />;
            case 'history': return <History history={history} setHistory={setHistory} user={user} tableStyle={appearance.tableStyle} />;
            case 'admin': return user.role === 'admin' ? <AdminPanel onActionComplete={fetchHistory} tableStyle={appearance.tableStyle} /> : null;
            case 'settings': return <Settings user={user} appearance={appearance} updateAppearance={updateAppearance} />;
            default: return <FormulaGenerator onActionComplete={fetchHistory} user={user} />;
          }
        })()}
      </div>
    );
  };

  const bannerClass = `banner-${appearance.bannerStyle}`;

  return (
    <div className="flex h-screen text-slate-200 overflow-hidden" style={{ fontFamily: `'${appearance.fontFamily}', sans-serif` }}>
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        userRole={user.role} 
        onLogout={onLogout}
        themeColor={appearance.themeColor}
      />
      <main className="flex-1 ml-72 overflow-y-auto">
        <div className={`${bannerClass} px-12 py-16 relative overflow-hidden transition-all duration-700`}>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -ml-10 -mb-10 blur-2xl"></div>
          
          <div className="relative z-10 flex justify-between items-center">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-white/80 text-sm font-bold uppercase tracking-widest mb-4">
                <i className="fa-solid fa-sparkles"></i>
                <span>{appearance.themeColor} edition platform</span>
              </div>
              <h2 className="text-5xl font-bold text-white mb-4 tracking-tighter">
                {tabTitles[activeTab]?.title || 'Dashboard'}
              </h2>
              <p className="text-white/80 text-lg font-light leading-relaxed">
                {tabTitles[activeTab]?.desc}
              </p>
            </div>
            
            <div className="hidden lg:flex flex-col items-end text-right">
              <div className="glass px-6 py-4 rounded-2xl border-white/20">
                <p className="text-white/60 text-xs uppercase font-bold tracking-widest mb-1">Signed in as</p>
                <p className="text-white font-bold text-lg">{user.email}</p>
                <div className="flex items-center justify-end gap-2 mt-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-[10px] text-emerald-100 uppercase font-black">{user.role} ACCESS</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-12 py-12 max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
