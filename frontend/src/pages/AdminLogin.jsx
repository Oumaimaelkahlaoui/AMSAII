import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Lock, User, ArrowRight, Sparkle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import amsaiiLogo from '../assets/amsaii-logo.svg';
export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [pass, setPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:3001/admin/login', { username, pass });
      if (response.data.success) {
        localStorage.setItem('amsaii_admin_token', response.data.token);
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError('Nom d\u2019utilisateur ou mot de passe incorrect.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#FDFBF7] overflow-hidden flex items-center justify-center p-6">
      {/* Fond flouté ambiant */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-24 w-[420px] h-[420px] rounded-full bg-[#C4924A]/25 blur-[110px]" />
        <div className="absolute top-1/3 -right-32 w-[480px] h-[480px] rounded-full bg-[#E8CBA0]/40 blur-[130px]" />
        <div className="absolute bottom-0 left-1/4 w-[380px] h-[380px] rounded-full bg-[#D9CBB0]/35 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-md w-full bg-white/70 backdrop-blur-2xl p-8 sm:p-10 rounded-[32px] border border-white/80 shadow-[0_20px_60px_-15px_rgba(26,26,26,0.15)]">
        <div className="text-center mb-8">
          <div style={{ height: 120 , display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={amsaiiLogo} alt="AMSAII Logo" className="logo" />
                </div>

          <span className="text-[11px] uppercase tracking-[0.25em] text-[#8C8C8C] font-semibold mb-1.5 block">
            Sécurité
          </span>
          <h1 className="text-2xl font-serif text-[#1A1A1A]">Bon retour, Bienvenue
 </h1>
          <p className="text-xs text-[#66635D] mt-1.5">
            Connectez-vous pour accéder au suivi des check-ins.
          </p>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#8C8C8C] mb-1.5 font-medium">
              Identifiant
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 w-4 h-4 text-[#A8A39A]" />
              <input
                type="text"
                required
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full bg-[#FAF9F6]/80 border border-[#E8E4DE] rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#8A6A3A] focus:ring-2 focus:ring-[#C4924A]/15 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#8C8C8C] mb-1.5 font-medium">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-[#A8A39A]" />
              <input
                type={showPass ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#FAF9F6]/80 border border-[#E8E4DE] rounded-xl pl-10 pr-10 py-3 text-sm focus:outline-none focus:border-[#8A6A3A] focus:ring-2 focus:ring-[#C4924A]/15 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-3.5 top-3.5 text-[#A8A39A] hover:text-[#1A1A1A] transition-colors"
                tabIndex={-1}
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1A1A1A] text-[#FDFBF7] py-3.5 rounded-xl flex items-center justify-center gap-2 text-xs uppercase tracking-wider font-medium hover:bg-[#3E2A16] transition-all cursor-pointer mt-6 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
            <span>{loading ? 'Connexion en cours...' : 'Se connecter'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}