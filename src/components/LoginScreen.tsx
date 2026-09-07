import React, { useState } from 'react';
import { IdCard, Eye, EyeOff, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';
import { SenaLogo } from './SenaLogo';
import { User } from '../types';

interface LoginScreenProps {
  onLogin: (user: User) => void;
  users: User[];
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, users }) => {
  const [documentNumber, setDocumentNumber] = useState('80123999'); // Default Celador John D.
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanDoc = documentNumber.replace(/\D/g, '');
    const matchedUser = users.find(u => u.documentNumber === cleanDoc);

    if (matchedUser) {
      onLogin(matchedUser);
    } else {
      // If doc not strictly matching numbers, try by name or fallback to Celador
      const fallbackUser = users.find(u => u.role === 'celador') || users[0];
      onLogin(fallbackUser);
    }
  };

  const handleQuickSelect = (doc: string) => {
    const found = users.find(u => u.documentNumber === doc);
    if (found) {
      setDocumentNumber(found.documentNumber);
      onLogin(found);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] flex flex-col items-center justify-center p-4 sm:p-6 select-none relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#39A900]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Card */}
      <div className="w-full max-w-[360px] sm:max-w-[400px] md:max-w-[420px] bg-white rounded-3xl shadow-xl shadow-slate-200/70 border border-slate-200/80 p-6 sm:p-9 md:p-10 flex flex-col items-center relative z-10 transition-all">
        {/* SENA Official Emblem - Responsive Sizing for Mobile, Tablet & PC */}
        <div className="mb-4 p-3 sm:p-3.5 bg-emerald-50/60 rounded-3xl border border-emerald-100/80 shadow-inner flex items-center justify-center">
          <SenaLogo className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20" />
        </div>

        {/* Headings */}
        <div className="text-center mb-6 sm:mb-8">
          <span className="text-[10px] sm:text-xs font-extrabold text-[#1C7C00] uppercase tracking-wider block mb-1">
            Servicio Nacional de Aprendizaje
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            Control de Acceso
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Ingrese sus credenciales institucionales
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-6">
          {error && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          {/* Document Input */}
          <div className="relative border-b border-slate-300 focus-within:border-[#39A900] transition-colors pb-1">
            <input
              id="login-documento"
              type="text"
              value={documentNumber}
              onChange={(e) => setDocumentNumber(e.target.value)}
              placeholder="Documento"
              required
              className="w-full pr-8 text-sm text-slate-900 bg-transparent outline-hidden font-medium placeholder:text-slate-400"
            />
            <div className="absolute right-0 top-1 text-slate-400">
              <IdCard className="w-5 h-5" />
            </div>
          </div>

          {/* Password Input */}
          <div className="relative border-b border-slate-300 focus-within:border-[#39A900] transition-colors pb-1">
            <input
              id="login-contrasena"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              required
              className="w-full pr-8 text-sm text-slate-900 bg-transparent outline-hidden font-medium placeholder:text-slate-400 tracking-wider"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 top-1 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Submit Button */}
          <button
            id="btn-ingresar"
            type="submit"
            className="w-full py-3 px-4 bg-[#39A900] hover:bg-[#2e8800] active:scale-[0.99] text-white font-bold rounded-xl shadow-md shadow-[#39A900]/25 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
          >
            <span>Ingresar</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Forgot Password Link */}
          <div className="text-center pt-1">
            <button
              type="button"
              onClick={() => alert('Para restablecimiento de credenciales, comuníquese con la Mesa de Ayuda TIC o Administración de la Sede.')}
              className="text-xs text-[#39A900] hover:underline font-semibold cursor-pointer"
            >
              ¿Olvidó su contraseña?
            </button>
          </div>
        </form>

        {/* Footer version notice from Image 3 */}
        <div className="mt-10 pt-6 border-t border-slate-100 w-full text-center">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Seguridad Operacional
          </div>
          <div className="text-[11px] text-slate-400 font-medium">
            v2.4.1
          </div>
        </div>
      </div>

      {/* Sub-card security warning from Image 3 */}
      <p className="text-xs text-slate-400 text-center max-w-sm mt-6 leading-relaxed">
        Uso exclusivo para personal autorizado. Todo acceso es registrado y monitoreado.
      </p>

      {/* Demo helper shortcuts */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2 max-w-md">
        <span className="text-[11px] font-semibold text-slate-400 mr-1">
          Ingreso rápido de prueba:
        </span>
        <button
          onClick={() => handleQuickSelect('80123999')}
          className="px-2.5 py-1 bg-white border border-slate-200 hover:border-[#39A900] text-slate-700 text-xs rounded-lg font-medium shadow-2xs hover:bg-emerald-50 transition-colors"
        >
          🛡️ Celador (John D.)
        </button>
        <button
          onClick={() => handleQuickSelect('52441980')}
          className="px-2.5 py-1 bg-white border border-slate-200 hover:border-[#39A900] text-slate-700 text-xs rounded-lg font-medium shadow-2xs hover:bg-emerald-50 transition-colors"
        >
          ⚙️ Admin (Laura Roa)
        </button>
        <button
          onClick={() => handleQuickSelect('1023456789')}
          className="px-2.5 py-1 bg-white border border-slate-200 hover:border-[#39A900] text-slate-700 text-xs rounded-lg font-medium shadow-2xs hover:bg-emerald-50 transition-colors"
        >
          🎓 Instructor (Juan Carlos)
        </button>
      </div>
    </div>
  );
};
