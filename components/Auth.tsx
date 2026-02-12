import React, { useState } from 'react';
import { UserProfile } from '../types';
import { mockSupabase } from '../services/mockSupabase';

interface Props {
  onLogin: (user: UserProfile) => void;
}

const Auth: React.FC<Props> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email || !password) {
      alert('Silakan masukkan email dan password.');
      return;
    }
    setLoading(true);
    try {
      const user = await mockSupabase.login(email);
      onLogin(user);
    } catch (err) {
      alert('Login gagal. Silakan coba lagi.');
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isActive) {
      if (e.key === 'Enter') {
        handleSubmit();
      } else if (e.key === 'Escape') {
        setIsActive(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden" onKeyDown={handleKeyDown}>
      <style>{`
        #mainButton {
          color: white;
          border: none;
          outline: none;
          font-size: 14px;
          font-weight: 700;
          overflow: hidden;
          position: relative;
          border-radius: 12px;
          letter-spacing: 2px;
          text-transform: uppercase;
          background-color: #00a7ee;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          width: 240px;
          height: 60px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 20px 40px rgba(0, 167, 238, 0.2);
        }

        #mainButton.active {
          box-shadow: none;
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          z-index: 999;
          border-radius: 0;
          width: 100vw;
          height: 100vh;
          cursor: default;
          overflow: visible;
        }

        .btn-text {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        #mainButton:not(.active):hover {
          transform: translateY(-2px) scale(1.02);
          background-color: #00b8ff;
          box-shadow: 0 25px 50px rgba(0, 167, 238, 0.3);
        }

        .modal {
          top: 0; left: 0;
          z-index: 3;
          width: 100%; height: 100%;
          display: flex;
          position: absolute;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          background-color: #020617;
          transform-origin: center center;
          background-image: radial-gradient(circle at center, #0f172a 0%, #020617 100%);
          transform: scale(1.2);
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0;
          pointer-events: none;
        }

        #mainButton.active .modal {
          transform: scale(1);
          opacity: 1;
          pointer-events: auto;
        }

        .close-button {
          top: 40px; right: 40px;
          position: absolute;
          font-size: 24px;
          cursor: pointer;
          transition: all 0.3s;
          color: #64748b;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: rgba(255,255,255,0.03);
          z-index: 10;
        }

        .close-button:hover { 
          color: white;
          background: rgba(255,255,255,0.08);
          transform: rotate(90deg);
        }

        .auth-container {
          width: 100%;
          max-width: 440px;
          padding: 48px;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 32px;
          position: relative;
          z-index: 4;
          box-shadow: 0 40px 80px rgba(0,0,0,0.4);
        }

        .input-group {
          width: 100%;
          padding-top: 25px;
          position: relative;
          margin-bottom: 24px;
        }

        .input-group input {
          width: 100%;
          color: white;
          border: none;
          outline: none;
          padding: 12px 0;
          font-size: 16px;
          border-bottom: solid 1px rgba(255,255,255,0.1);
          background-color: transparent;
          transition: border-color 0.3s;
        }

        .input-group input:focus {
          border-bottom-color: #00a7ee;
        }

        .input-group label {
          left: 0; top: 32px;
          position: absolute;
          pointer-events: none;
          transition: all 0.3s ease;
          font-weight: 500;
          color: #64748b;
        }

        .input-group input:focus + label,
        .input-group input.has-value + label {
          font-size: 12px;
          transform: translateY(-38px);
          font-weight: 700;
          color: #00a7ee;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .form-button {
          width: 100%;
          padding: 18px;
          color: white;
          margin-top: 32px;
          text-align: center;
          background: linear-gradient(135deg, #00a7ee 0%, #4f46e5 100%);
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          border-radius: 12px;
          font-size: 16px;
          letter-spacing: 1px;
        }

        .form-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 30px rgba(0, 167, 238, 0.3);
        }
      `}</style>

      <div className="mb-20 text-center animate-fade-in relative z-0">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="w-12 h-12 bg-[#00a7ee]/10 rounded-xl flex items-center justify-center border border-[#00a7ee]/20">
            <i className="fa-solid fa-bolt-lightning text-[#00a7ee] text-2xl"></i>
          </div>
          <h1 className="text-5xl font-bold text-white tracking-tighter">
            OPERATOR <span className="text-[#00a7ee]">AI</span>
          </h1>
        </div>
        <p className="text-slate-500 font-medium text-lg tracking-wide max-w-md mx-auto">
          Arsitektur AI Tercanggih untuk Profesional Spreadsheet.
        </p>
      </div>

      <div 
        id="mainButton" 
        className={isActive ? 'active' : ''} 
        onClick={() => !isActive && setIsActive(true)}
      >
        {!isActive && (
          <div className="btn-text">
            <span>Masuk ke Platform</span>
            <i className="fa-solid fa-arrow-right"></i>
          </div>
        )}
        
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="close-button" onClick={() => setIsActive(false)}>✕</div>
          
          <div className="auth-container">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Login Operator</h2>
              <p className="text-slate-500 text-sm">Gunakan kredensial Anda untuk melanjutkan.</p>
            </div>
            
            <div className="input-group">
              <input 
                type="email" 
                id="email" 
                className={email ? 'has-value' : ''}
                value={email}
                autoComplete="off"
                onChange={(e) => setEmail(e.target.value)}
              />
              <label htmlFor="email">Email Address</label>
            </div>

            <div className="input-group">
              <input 
                type="password" 
                id="password" 
                className={password ? 'has-value' : ''}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label htmlFor="password">Password</label>
            </div>

            <div className="form-button" onClick={() => handleSubmit()}>
              {loading ? 'AUTENTIKASI...' : 'MASUK SEKARANG'}
            </div>
            
            <p className="mt-8 text-center text-slate-600 text-xs font-bold uppercase tracking-widest">
              Operator AI Pro &copy; 2024
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
