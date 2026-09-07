import React, { useState } from 'react';
import { Bell, LogOut, ShieldCheck, UserCheck, AlertCircle, Check, Menu, Database } from 'lucide-react';
import { User, UserRole } from '../types';
import { SenaLogo } from './SenaLogo';

interface TopHeaderProps {
  title: string;
  currentUser: User;
  onLogout: () => void;
  onSwitchRole: (role: UserRole) => void;
  pendingPhotosCount: number;
  onOpenSupabaseModal?: () => void;
  onToggleMobileMenu?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  title,
  currentUser,
  onLogout,
  onSwitchRole,
  pendingPhotosCount,
  onOpenSupabaseModal,
  onToggleMobileMenu
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  return (
    <header className="h-16 px-3 sm:px-6 lg:px-8 bg-white border-b border-slate-200/80 flex items-center justify-between sticky top-0 z-30 select-none">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* Mobile & Tablet Hamburger Menu Button */}
        {onToggleMobileMenu && (
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer shrink-0"
            title="Abrir menú"
            aria-label="Abrir menú"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Mobile & Tablet: SENA Logo accommodation when sidebar is hidden */}
        <div className="lg:hidden flex items-center gap-2 shrink-0">
          <SenaLogo 
            className="w-7 h-7 sm:w-8 sm:h-8" 
            showText={true}
            mode="auto"
          />
          <div className="h-4 w-px bg-slate-200 hidden xs:block sm:block" />
        </div>

        {/* Screen Title */}
        <h1 className="text-sm sm:text-base lg:text-xl font-bold text-slate-900 tracking-tight truncate max-w-[130px] xs:max-w-[200px] sm:max-w-none">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-3">
        {/* Supabase Status Button */}
        {onOpenSupabaseModal && (
          <button
            onClick={onOpenSupabaseModal}
            className="flex items-center gap-1.5 px-2 sm:px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-xs font-semibold transition-all shadow-xs cursor-pointer border border-slate-700 shrink-0"
            title="Ver conexión y tablas de Supabase"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3ECF8E] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#3ECF8E]"></span>
            </span>
            <span className="tracking-wider flex items-center gap-1 font-mono text-[10px] sm:text-[11px]">
              <span className="text-[#3ECF8E] font-bold">SUPABASE</span>
              <span className="text-slate-300 hidden md:inline">CONECTADO</span>
            </span>
          </button>
        )}

        {/* System Online Status Badge */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded-full text-xs font-semibold shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="tracking-wide">SISTEMA ONLINE</span>
        </div>

        {/* Role Quick Switcher */}
        <div className="relative shrink-0">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-xs font-medium text-slate-700 cursor-pointer"
            title="Cambiar rol activo para probar funcionalidades"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#39A900] shrink-0" />
            <span className="font-bold capitalize text-[11px] sm:text-xs truncate max-w-[70px] sm:max-w-none">
              {currentUser.role}
            </span>
            <span className="text-[9px] text-slate-400">▼</span>
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-64 max-w-[90vw] bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                Simular Rol en Sistema
              </div>
              <button
                onClick={() => {
                  onSwitchRole('celador');
                  setShowRoleMenu(false);
                }}
                className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="font-bold">Celador de Turno</div>
                  <div className="text-[10px] text-slate-400">Escaneo y Portería</div>
                </div>
                {currentUser.role === 'celador' && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
              </button>
              <button
                onClick={() => {
                  onSwitchRole('admin');
                  setShowRoleMenu(false);
                }}
                className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="font-bold">Administrador</div>
                  <div className="text-[10px] text-slate-400">Aprobación fotos & Fichas</div>
                </div>
                {currentUser.role === 'admin' && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
              </button>
              <button
                onClick={() => {
                  onSwitchRole('instructor');
                  setShowRoleMenu(false);
                }}
                className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="font-bold">Instructor Técnico</div>
                  <div className="text-[10px] text-slate-400">Carnet Digital Juan Carlos</div>
                </div>
                {currentUser.role === 'instructor' && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
              </button>
              <button
                onClick={() => {
                  onSwitchRole('aprendiz');
                  setShowRoleMenu(false);
                }}
                className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="font-bold">Aprendiz SENA</div>
                  <div className="text-[10px] text-slate-400">Carnet Digital Carlos R.</div>
                </div>
                {currentUser.role === 'aprendiz' && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
              </button>
            </div>
          )}
        </div>

        {/* Notifications Icon */}
        <div className="relative shrink-0">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-1.5 sm:p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors relative cursor-pointer"
            aria-label="Notificaciones"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            {pendingPhotosCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-white"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-[calc(100vw-24px)] sm:w-80 max-w-sm bg-white rounded-2xl shadow-xl border border-slate-200 p-3.5 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                <span className="text-xs font-bold text-slate-800">Notificaciones Operacionales</span>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                  {pendingPhotosCount} pendientes
                </span>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                <div className="p-2.5 bg-amber-50 rounded-xl text-xs text-amber-900 flex gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                  <div>
                    <div className="font-bold">{pendingPhotosCount} Fotografías por revisar</div>
                    <div className="text-[11px] text-amber-700">
                      Carnets inactivos hasta que el Administrador valide los rostros.
                    </div>
                  </div>
                </div>
                <div className="p-2.5 bg-emerald-50 rounded-xl text-xs text-emerald-900 flex gap-2.5">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                  <div>
                    <div className="font-bold">Control de Acceso Activo</div>
                    <div className="text-[11px] text-emerald-700">Torniquetes y escáneres sincronizados</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Logout button */}
        <button
          onClick={onLogout}
          className="p-1.5 sm:p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
          title="Cerrar sesión"
          aria-label="Cerrar sesión"
        >
          <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </header>
  );
};
