
import React, { useState, useEffect } from 'react';
import { UserProfile, AppearanceSettings } from './types';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import { mockSupabase } from './services/mockSupabase';

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
    // Sync User
    const savedUser = mockSupabase.getCurrentUser();
    if (savedUser) setUser(savedUser);

    // Sync Appearance from LocalStorage
    const savedAppearance = localStorage.getItem('op_appearance');
    if (savedAppearance) {
      const parsed = JSON.parse(savedAppearance);
      setAppearance(parsed);
      applyAppearance(parsed);
    } else {
      applyAppearance(defaultSettings);
    }
    
    setInitializing(false);
  }, []);

  const applyAppearance = (settings: AppearanceSettings) => {
    // Apply Font
    document.documentElement.style.setProperty('--font-main', `'${settings.fontFamily}', sans-serif`);
    
    // Apply Theme Color RGB (for radial gradients)
    const colorMap: Record<string, string> = {
      blue: '0, 167, 238',
      purple: '139, 92, 246',
      emerald: '16, 185, 129',
      rose: '244, 63, 94',
      amber: '245, 158, 11'
    };
    document.documentElement.style.setProperty('--primary-rgb', colorMap[settings.themeColor]);
    document.documentElement.style.setProperty('--primary', `rgb(${colorMap[settings.themeColor]})`);

    // Apply Background Layer Class
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

  const handleLogout = () => {
    mockSupabase.logout();
    setUser(null);
  };

  if (initializing) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-indigo-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
            <i className="fa-solid fa-calculator text-indigo-500 text-3xl"></i>
          </div>
          <div className="flex items-center gap-2 text-slate-500 font-medium">
             <i className="fa-solid fa-circle-notch fa-spin"></i> Menyiapkan Sistem...
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
