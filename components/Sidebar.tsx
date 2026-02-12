
import React from 'react';
import { NavItem, UserRole } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: UserRole;
  onLogout: () => void;
  themeColor?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, userRole, onLogout, themeColor = 'blue' }) => {
  const navItems: NavItem[] = [
    { id: 'generator', label: 'AI Formula Generator', icon: 'fa-wand-magic-sparkles' },
    { id: 'checker', label: 'Pemeriksa Kesalahan', icon: 'fa-bug-slash' },
    { id: 'ideas', label: 'Idea Generator', icon: 'fa-lightbulb' },
    { id: 'analyzer', label: 'Sheets Analyzer', icon: 'fa-magnifying-glass-chart' },
    { id: 'history', label: 'Riwayat Aktivitas', icon: 'fa-clock-rotate-left' },
    { id: 'admin', label: 'Panel Admin', icon: 'fa-shield-halved', adminOnly: true },
    { id: 'settings', label: 'Pengaturan', icon: 'fa-gear' },
  ];

  const getColorClass = () => {
    switch(themeColor) {
      case 'purple': return 'bg-purple-600 text-purple-400';
      case 'emerald': return 'bg-emerald-600 text-emerald-400';
      case 'rose': return 'bg-rose-600 text-rose-400';
      case 'amber': return 'bg-amber-600 text-amber-400';
      default: return 'bg-indigo-600 text-indigo-400';
    }
  };

  const iconBg = getColorClass().split(' ')[0];
  const activeText = getColorClass().split(' ')[1];

  return (
    <aside className="w-72 bg-slate-950 border-r border-slate-800 flex flex-col h-screen fixed left-0 top-0 z-50 shadow-2xl">
      <div className="p-8">
        <div className="flex items-center gap-4 mb-10 group cursor-pointer">
          <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105`}>
            <i className="fa-solid fa-bolt-lightning text-white text-2xl"></i>
          </div>
          <div>
            <h1 className="font-bold text-[10px] tracking-widest uppercase text-slate-600">Operator AI</h1>
            <p className="font-bold text-xl text-white tracking-tight">Formula <span className={activeText}>Pro</span></p>
          </div>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            if (item.adminOnly && userRole !== 'admin') return null;
            
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300 group ${
                  isActive 
                  ? `bg-white/5 ${activeText} border border-white/5 shadow-inner` 
                  : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'
                }`}
              >
                <i className={`fa-solid ${item.icon} w-6 text-lg transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}></i>
                <span className="font-bold text-xs uppercase tracking-wider">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-8 border-t border-slate-900">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-4 px-5 py-4 text-slate-600 hover:text-rose-400 hover:bg-rose-500/5 rounded-xl transition-all group"
        >
          <i className="fa-solid fa-right-from-bracket w-6 text-lg"></i>
          <span className="font-bold text-xs uppercase tracking-wider">Keluar Akun</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
