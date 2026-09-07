import React from 'react';
import { 
  LayoutGrid, 
  QrCode, 
  UserPlus, 
  History, 
  User as UserIcon, 
  Settings, 
  Menu 
} from 'lucide-react';
import { TabType } from './Sidebar';
import { User } from '../types';

interface MobileBottomNavProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  currentUser: User;
  pendingPhotosCount: number;
  onOpenMobileMenu: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
  currentUser,
  pendingPhotosCount,
  onOpenMobileMenu
}) => {
  const isInstitutional = ['aprendiz', 'instructor', 'contratista', 'funcionario', 'subdirector'].includes(currentUser.role);

  return (
    <nav 
      aria-label="Navegación móvil"
      className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200/90 z-40 lg:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1 flex items-center justify-around select-none safe-area-inset-bottom"
    >
      {/* Dashboard */}
      <button
        type="button"
        onClick={() => onSelectTab('dashboard')}
        className={`flex flex-col items-center justify-center min-w-[56px] py-1.5 px-2 rounded-xl transition-all cursor-pointer ${
          activeTab === 'dashboard'
            ? 'text-[#39A900] font-bold'
            : 'text-slate-400 hover:text-slate-700'
        }`}
      >
        <div className={`p-1 rounded-lg transition-transform ${activeTab === 'dashboard' ? 'bg-emerald-50 scale-110' : ''}`}>
          <LayoutGrid className="w-5 h-5" />
        </div>
        <span className="text-[10px] tracking-tight mt-0.5">Inicio</span>
      </button>

      {/* Escáner - For Celador and Admin */}
      {!isInstitutional && (
        <button
          type="button"
          onClick={() => onSelectTab('scanner')}
          className={`flex flex-col items-center justify-center min-w-[56px] py-1.5 px-2 rounded-xl transition-all cursor-pointer relative ${
            activeTab === 'scanner'
              ? 'text-[#39A900] font-bold'
              : 'text-slate-400 hover:text-slate-700'
          }`}
        >
          <div className={`p-1 rounded-lg transition-transform ${activeTab === 'scanner' ? 'bg-emerald-50 scale-110' : ''}`}>
            <QrCode className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Escanear</span>
        </button>
      )}

      {/* Registrar Visitantes / Vehículos - For Celador and Admin */}
      {!isInstitutional && (
        <button
          type="button"
          onClick={() => onSelectTab('visitors')}
          className={`flex flex-col items-center justify-center min-w-[56px] py-1.5 px-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'visitors'
              ? 'text-[#39A900] font-bold'
              : 'text-slate-400 hover:text-slate-700'
          }`}
        >
          <div className={`p-1 rounded-lg transition-transform ${activeTab === 'visitors' ? 'bg-emerald-50 scale-110' : ''}`}>
            <UserPlus className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Registro</span>
        </button>
      )}

      {/* Carnet Digital */}
      <button
        type="button"
        onClick={() => onSelectTab('carnet')}
        className={`flex flex-col items-center justify-center min-w-[56px] py-1.5 px-2 rounded-xl transition-all cursor-pointer ${
          activeTab === 'carnet'
            ? 'text-[#39A900] font-bold'
            : 'text-slate-400 hover:text-slate-700'
        }`}
      >
        <div className={`p-1 rounded-lg transition-transform ${activeTab === 'carnet' ? 'bg-emerald-50 scale-110' : ''}`}>
          <UserIcon className="w-5 h-5" />
        </div>
        <span className="text-[10px] tracking-tight mt-0.5">Carnet</span>
      </button>

      {/* Historial (Celador/Admin) or Configuración (Institutional) */}
      {!isInstitutional ? (
        <button
          type="button"
          onClick={() => onSelectTab('history')}
          className={`flex flex-col items-center justify-center min-w-[56px] py-1.5 px-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'history'
              ? 'text-[#39A900] font-bold'
              : 'text-slate-400 hover:text-slate-700'
          }`}
        >
          <div className={`p-1 rounded-lg transition-transform ${activeTab === 'history' ? 'bg-emerald-50 scale-110' : ''}`}>
            <History className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Historial</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => onSelectTab('admin')}
          className={`flex flex-col items-center justify-center min-w-[56px] py-1.5 px-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'admin'
              ? 'text-[#39A900] font-bold'
              : 'text-slate-400 hover:text-slate-700'
          }`}
        >
          <div className={`p-1 rounded-lg transition-transform ${activeTab === 'admin' ? 'bg-emerald-50 scale-110' : ''}`}>
            <Settings className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Ajustes</span>
        </button>
      )}

      {/* Menu Drawer Toggle Button */}
      <button
        type="button"
        onClick={onOpenMobileMenu}
        className="flex flex-col items-center justify-center min-w-[56px] py-1.5 px-2 rounded-xl text-slate-400 hover:text-slate-800 transition-all cursor-pointer relative"
        title="Abrir menú de navegación"
        aria-label="Abrir menú de navegación"
      >
        <div className="p-1 rounded-lg relative">
          <Menu className="w-5 h-5" />
          {pendingPhotosCount > 0 && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-white" />
          )}
        </div>
        <span className="text-[10px] tracking-tight mt-0.5">Menú</span>
      </button>
    </nav>
  );
};
