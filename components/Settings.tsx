
import React from 'react';
import { UserProfile, AppearanceSettings } from '../types';

interface Props {
  user: UserProfile;
  appearance: AppearanceSettings;
  updateAppearance: (settings: Partial<AppearanceSettings>) => void;
}

const Settings: React.FC<Props> = ({ user, appearance, updateAppearance }) => {
  const fontOptions = ['Raleway', 'Poppins', 'Inter', 'JetBrains Mono'];
  const themeOptions = [
    { id: 'blue', color: '#00a7ee', label: 'Classic Blue' },
    { id: 'purple', color: '#8b5cf6', label: 'Royal Purple' },
    { id: 'emerald', color: '#10b981', label: 'Forest Emerald' },
    { id: 'rose', color: '#f43f5e', label: 'Vibrant Rose' },
    { id: 'amber', color: '#f59e0b', label: 'Golden Amber' }
  ];
  const bannerOptions = [
    { id: 'default', label: 'Skyline' },
    { id: 'sunset', label: 'Golden Hour' },
    { id: 'ocean', label: 'Deep Sea' },
    { id: 'forest', label: 'Rainforest' },
    { id: 'monochrome', label: 'Midnight' }
  ];
  const bgOptions = [
    { id: 'mesh', icon: 'fa-wind', label: 'Animated Mesh' },
    { id: 'solid', icon: 'fa-square', label: 'Clean Solid' },
    { id: 'dots', icon: 'fa-ellipsis-vertical', label: 'Micro Dots' },
    { id: 'stars', icon: 'fa-star', label: 'Stardust' }
  ];
  const tableStyles = [
    { id: 'glass', label: 'Glassmorphism' },
    { id: 'solid', label: 'High Contrast' },
    { id: 'minimal', label: 'Minimalist' }
  ];

  return (
    <div className="space-y-10 animate-in slide-in-from-right-4 duration-500 pb-20">
      {/* 1. Theme & Colors */}
      <section className="glass rounded-3xl p-8 border border-slate-800">
        <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
          <i className="fa-solid fa-palette text-indigo-500"></i> Tema & Warna Utama
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {themeOptions.map(opt => (
            <button
              key={opt.id}
              onClick={() => updateAppearance({ themeColor: opt.id as any })}
              className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all ${
                appearance.themeColor === opt.id ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-800 hover:border-slate-600'
              }`}
            >
              <div className="w-10 h-10 rounded-full shadow-lg" style={{ backgroundColor: opt.color }}></div>
              <span className="text-xs font-bold text-slate-300">{opt.label}</span>
            </button>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 2. Banner Style */}
        <section className="glass rounded-3xl p-8 border border-slate-800">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <i className="fa-solid fa-image text-emerald-500"></i> Gaya Banner
          </h3>
          <div className="space-y-3">
            {bannerOptions.map(opt => (
              <button
                key={opt.id}
                onClick={() => updateAppearance({ bannerStyle: opt.id as any })}
                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                  appearance.bannerStyle === opt.id ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-800 hover:bg-white/5'
                }`}
              >
                <span className="text-sm font-medium text-slate-200">{opt.label}</span>
                <div className={`w-12 h-4 rounded banner-${opt.id}`}></div>
              </button>
            ))}
          </div>
        </section>

        {/* 3. Background Engine */}
        <section className="glass rounded-3xl p-8 border border-slate-800">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <i className="fa-solid fa-clapperboard text-rose-500"></i> Efek Latar Belakang
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {bgOptions.map(opt => (
              <button
                key={opt.id}
                onClick={() => updateAppearance({ backgroundType: opt.id as any })}
                className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                  appearance.backgroundType === opt.id ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-800 hover:bg-white/5'
                }`}
              >
                <i className={`fa-solid ${opt.icon} text-slate-400`}></i>
                <span className="text-sm font-medium text-slate-200">{opt.label}</span>
              </button>
            ))}
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 4. Font Family */}
        <section className="glass rounded-3xl p-8 border border-slate-800">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <i className="fa-solid fa-font text-amber-500"></i> Tipografi (Font)
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {fontOptions.map(font => (
              <button
                key={font}
                onClick={() => updateAppearance({ fontFamily: font as any })}
                style={{ fontFamily: `'${font}', sans-serif` }}
                className={`p-4 rounded-xl border transition-all text-left ${
                  appearance.fontFamily === font ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-800 hover:bg-white/5'
                }`}
              >
                <span className="text-sm">{font}</span>
              </button>
            ))}
          </div>
        </section>

        {/* 5. Table Style */}
        <section className="glass rounded-3xl p-8 border border-slate-800">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <i className="fa-solid fa-table text-indigo-400"></i> Gaya Tabel & List
          </h3>
          <div className="space-y-3">
            {tableStyles.map(style => (
              <button
                key={style.id}
                onClick={() => updateAppearance({ tableStyle: style.id as any })}
                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                  appearance.tableStyle === style.id ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-800 hover:bg-white/5'
                }`}
              >
                <span className="text-sm font-medium text-slate-200">{style.label}</span>
                <i className={`fa-solid ${appearance.tableStyle === style.id ? 'fa-circle-check text-indigo-400' : 'fa-circle text-slate-800'}`}></i>
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Account Info (Moved to bottom) */}
      <section className="glass rounded-3xl p-8 border border-slate-800">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Informasi Akun</h3>
        <div className="flex flex-wrap gap-12">
           <div>
              <p className="text-xs text-slate-600 mb-1">Email</p>
              <p className="text-white font-medium">{user.email}</p>
           </div>
           <div>
              <p className="text-xs text-slate-600 mb-1">Role</p>
              <p className="text-indigo-400 font-bold uppercase text-xs tracking-tighter">{user.role}</p>
           </div>
           <div>
              <p className="text-xs text-slate-600 mb-1">ID</p>
              <p className="text-slate-500 font-mono text-[10px]">{user.id}</p>
           </div>
        </div>
      </section>
    </div>
  );
};

export default Settings;
