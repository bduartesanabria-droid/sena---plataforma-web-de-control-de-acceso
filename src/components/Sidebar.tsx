import React from 'react';
import { 
  LayoutGrid, 
  QrCode, 
  Users, 
  History, 
  User as UserIcon, 
  Settings,
  ShieldAlert,
  Car,
  X
} from 'lucide-react';
import { SenaLogo } from './SenaLogo';
import { User } from '../types';

export type TabType = 'dashboard' | 'scanner' | 'visitors' | 'history' | 'carnet' | 'admin';

interface SidebarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  currentUser: User;
  pendingPhotosCount: number;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  currentUser,
  pendingPhotosCount,
  isMobileOpen = false,
  onCloseMobile
}) => {
  const isInstitutional = ['aprendiz', 'instructor', 'contratista', 'funcionario', 'subdirector'].includes(currentUser.role);
  const isAdmin = currentUser.role === 'admin';

  const menuItems = [
    {
      id: 'dashboard' as TabType,
      label: 'Dashboard',
      icon: LayoutGrid,
      visible: true
    },
    {
      id: 'scanner' as TabType,
      label: 'Escáner',
      icon: QrCode,
      visible: !isInstitutional // Celador & Admin primary
    },
    {
      id: 'visitors' as TabType,
      label: 'Visitantes/Vehículos',
      icon: Users,
      visible: !isInstitutional
    },
    {
      id: 'history' as TabType,
      label: 'Historial',
      icon: History,
      visible: !isInstitutional
    },
    {
      id: 'carnet' as TabType,
      label: isInstitutional ? 'Mi Carnet Digital' : 'Usuarios / Carnets',
      icon: UserIcon,
      visible: true
    },
    {
      id: 'admin' as TabType,
      label: 'Configuración',
      icon: Settings,
      visible: true,
      badge: pendingPhotosCount > 0 ? pendingPhotosCount : undefined
    }
  ];

  const handleSelectTab = (tab: TabType) => {
    onSelectTab(tab);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full select-none bg-[#F8F9FA]">
      {/* Brand Header */}
      <div className="h-20 px-5 sm:px-6 flex items-center justify-between border-b border-slate-200/80 bg-white/60">
        <SenaLogo 
          className="w-10 h-10 lg:w-11 lg:h-11" 
          showText={true} 
          textSubtitle="Control de Acceso"
          mode="full" 
        />
        {onCloseMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden p-2 -mr-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 rounded-xl transition-colors cursor-pointer"
            title="Cerrar Menú"
            aria-label="Cerrar Menú"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto">
        {menuItems.filter(item => item.visible).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-150 text-left cursor-pointer ${
                isActive
                  ? 'bg-[#39A900] text-white shadow-md shadow-[#39A900]/20 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer User Profile Card */}
      <div className="p-3.5 border-t border-slate-200/80 bg-slate-100/70 m-3 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <img
              src={currentUser.photoUrl}
              alt={currentUser.fullName}
              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-xs"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white" />
          </div>

          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-slate-900 truncate">
              {currentUser.role === 'celador' ? 'Portería Principal' : currentUser.fullName}
            </h4>
            <p className="text-[11px] text-slate-500 truncate font-medium">
              {currentUser.roleLabel}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Permanent Sidebar */}
      <aside className="hidden lg:flex w-64 border-r border-slate-200/80 flex-col shrink-0 min-h-screen">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay and Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={onCloseMobile}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-[#F8F9FA] shadow-2xl z-50 flex flex-col animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
