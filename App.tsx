
import React, { useState, useEffect } from 'react';
import { UserProfile, AppearanceSettings } from './types';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import { supabaseService, isSupabaseConfigured } from './services/supabaseService';

const defaultSettings: AppearanceSettings = {
  bannerStyle: 'default',
  backgroundType: 'mesh',
  fontFamily: 'Raleway',
  themeColor: 'blue',
  tableStyle: 'glass'
};

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [appearance, setAppearance] = useState<AppearanceSettings>(defaultSettings);

  useEffect(() => {
    const init = async () => {
      // Hanya jalankan sync jika supabase sudah siap
      if (isSupabaseConfigured) {
        const savedUser = await supabaseService.getCurrentUser();
        if (savedUser) setUser(savedUser);
      }

      // Sync Appearance
      const savedAppearance = localStorage.getItem('op_appearance');
      if (savedAppearance) {
        const parsed = JSON.parse(savedAppearance);
        setAppearance(parsed);
        applyAppearance(parsed);
      } else {
        applyAppearance(defaultSettings);
      }
      
      setInitializing(false);
    };
    init();
  }, []);

  const applyAppearance = (settings: AppearanceSettings) => {
    document.documentElement.style.setProperty('--font-main', `'${settings.fontFamily}', sans-serif`);
    
    const colorMap: Record<string, string> = {
      blue: '0, 167, 238',
      purple: '139, 92, 246',
      emerald: '16, 185, 129',
      rose: '244, 63, 94',
      amber: '245, 158, 11'
    };
    document.documentElement.style.setProperty('--primary-rgb', colorMap[settings.themeColor]);
    document.documentElement.style.setProperty('--primary', `rgb(${colorMap[settings.themeColor]})`);

    const bgLayer = document.getElementById('bg-layer');
    if (bgLayer) {
      bgLayer.className = `bg-${settings.backgroundType}`;
    }
  };

  const updateAppearance = (newSettings: Partial<AppearanceSettings>) => {
    const updated = { ...appearance, ...newSettings };
    setAppearance(updated);
    localStorage.setItem('op_appearance', JSON.stringify(updated));
    applyAppearance(updated);
  };

  const handleLogin = (loggedUser: UserProfile) => {
    setUser(loggedUser);
  };

  const handleLogout = async () => {
    await supabaseService.logout();
    setUser(null);
  };

  // Tampilkan UI Eror jika Variabel Lingkungan Belum Diisi
  if (!isSupabaseConfigured && !initializing) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center">
        <div className="glass max-w-md p-10 rounded-3xl border-rose-500/20 shadow-2xl">
          <div className="w-20 h-20 bg-rose-500/10 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-rose-500/20">
            <i className="fa-solid fa-triangle-exclamation text-rose-500 text-4xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Konfigurasi Database Diperlukan</h2>
          <p className="text-slate-400 mb-8 leading-relaxed">
            Aplikasi tidak dapat terhubung ke database. Silakan masukkan <code className="text-indigo-400 bg-indigo-400/10 px-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code> dan <code className="text-indigo-400 bg-indigo-400/10 px-1 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> di pengaturan Vercel Anda.
          </p>
          <a 
            href="https://vercel.com" 
            target="_blank" 
            className="block w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-xl transition-all"
          >
            Buka Dashboard Vercel
          </a>
        </div>
      </div>
    );
  }

  if (initializing) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-indigo-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
            <i className="fa-solid fa-bolt-lightning text-indigo-500 text-3xl"></i>
          </div>
          <div className="flex items-center gap-2 text-slate-500 font-medium">
             <i className="fa-solid fa-circle-notch fa-spin"></i> Menghubungkan ke Database...
          </div>
        </div>
      </div>
    );
  }

  return user ? (
    <Dashboard 
      user={user} 
      onLogout={handleLogout} 
      appearance={appearance} 
      updateAppearance={updateAppearance} 
    />
  ) : (
    <Auth onLogin={handleLogin} />
  );
};

export default App;
