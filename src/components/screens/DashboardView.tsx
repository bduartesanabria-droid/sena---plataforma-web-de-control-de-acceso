import React from 'react';
import { 
  QrCode, 
  UserPlus, 
  Users, 
  UserCheck, 
  ClipboardList, 
  ArrowRight, 
  MoreVertical,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { AccessLog, TabType } from '../../types';
import { SenaLogo } from '../SenaLogo';

interface DashboardViewProps {
  onNavigate: (tab: TabType) => void;
  recentLogs: AccessLog[];
  peopleInCampus: number;
  visitorsTodayCount: number;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  recentLogs,
  peopleInCampus,
  visitorsTodayCount
}) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner Row: 2 Big Action Cards + 1 Estado Actual Widget */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        {/* Card 1: Escanear (Green) - Identical to Image 7 */}
        <button
          onClick={() => onNavigate('scanner')}
          className="md:col-span-4 bg-gradient-to-br from-[#1C7C00] to-[#125500] hover:from-[#239200] hover:to-[#176600] text-white rounded-3xl p-7 shadow-lg shadow-emerald-950/10 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-left flex flex-col justify-between min-h-[190px] relative overflow-hidden group cursor-pointer"
        >
          {/* Subtle authentic SENA emblem watermark */}
          <div className="absolute -bottom-6 -right-6 opacity-15 pointer-events-none group-hover:opacity-25 transition-opacity">
            <SenaLogo className="w-36 h-36" fillColor="#ffffff" />
          </div>

          <div className="flex justify-end w-full relative z-10">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xs group-hover:scale-110 transition-transform">
              <QrCode className="w-9 h-9 text-white" />
            </div>
          </div>
          <div className="relative z-10">
            <h3 className="text-3xl font-black tracking-tight text-white mb-1">
              Escanear
            </h3>
            <p className="text-xs font-bold text-white/80 tracking-wider uppercase">
              CARNET INSTITUCIONAL
            </p>
          </div>
        </button>

        {/* Card 2: Registrar (Orange) - Identical to Image 7 */}
        <button
          onClick={() => onNavigate('visitors')}
          className="md:col-span-4 bg-gradient-to-br from-[#EE8B1E] to-[#D46C00] hover:from-[#FA9526] hover:to-[#DE7403] text-white rounded-3xl p-7 shadow-lg shadow-orange-950/10 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-left flex flex-col justify-between min-h-[190px] relative overflow-hidden group cursor-pointer"
        >
          <div className="flex justify-end w-full">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xs group-hover:scale-110 transition-transform">
              <UserPlus className="w-9 h-9 text-white" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-black tracking-tight text-white mb-1">
              Registrar
            </h3>
            <p className="text-xs font-bold text-white/85 tracking-wider uppercase">
              CARNET INSTITUCIONAL / VISITANTE
            </p>
          </div>
        </button>

        {/* Card 3: Estado Actual - Identical to Image 7 */}
        <div className="md:col-span-4 bg-white rounded-3xl p-6 shadow-xs border border-slate-200/70 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="font-bold text-slate-800 text-sm">Estado Actual</h4>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse ring-4 ring-emerald-100" />
          </div>

          <div className="space-y-4 my-2">
            {/* Personas en sede */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium text-slate-500">Personas en sede</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-slate-900">{peopleInCampus}</span>
                <span className="text-xs font-bold text-emerald-600">↑ +12</span>
              </div>
            </div>

            {/* Visitantes hoy */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                  <UserCheck className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium text-slate-500">Visitantes hoy</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-black text-slate-900">{visitorsTodayCount}</span>
                <span className="text-[11px] font-medium text-slate-400">registrados</span>
              </div>
            </div>

            {/* Entradas pendientes */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <ClipboardList className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium text-slate-500">Entradas pdtes.</span>
              </div>
              <span className="text-xl font-black text-slate-900">0</span>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-1 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-[#39A900]" />
            Torniquetes y bahías sincronizados
          </div>
        </div>
      </div>

      {/* Accesos Recientes Table Section - Replicating Image 7 */}
      <div className="bg-white rounded-3xl p-7 shadow-xs border border-slate-200/70">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              Accesos Recientes
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Últimos movimientos registrados en portería principal
            </p>
          </div>
          <button
            onClick={() => onNavigate('history')}
            className="text-xs font-bold text-[#39A900] hover:text-[#2a7a00] flex items-center gap-1 hover:underline cursor-pointer"
          >
            <span>Ver todos</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile View (< md): Stacked Cards */}
        <div className="md:hidden space-y-3">
          {recentLogs.slice(0, 5).map((log) => {
            const isEntry = log.type === 'ENTRADA';
            return (
              <div 
                key={log.id} 
                className="p-3.5 bg-slate-50/70 border border-slate-200/80 rounded-2xl flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                    <img
                      src={`https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80`}
                      alt={log.fullName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80';
                      }}
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-800 text-xs truncate">
                      {log.fullName}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {log.role} • <span className="font-mono text-slate-400">CC {log.documentNumber}</span>
                    </p>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {log.timestamp.includes('Hoy,') ? log.timestamp.replace('Hoy,', '').trim() : log.timestamp}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    isEntry 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' 
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}>
                    {isEntry ? '→ ENTRADA' : '← SALIDA'}
                  </span>
                  <button 
                    onClick={() => alert(`Detalles del registro:\nUsuario: ${log.fullName}\nDocumento: ${log.documentNumber}\nPuerta: ${log.gate}\nOperador: ${log.celadorName}`)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop View (>= md): Full Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="pb-3 font-semibold">Usuario</th>
                <th className="pb-3 font-semibold">Tipo / Documento</th>
                <th className="pb-3 font-semibold">Hora</th>
                <th className="pb-3 font-semibold">Movimiento</th>
                <th className="pb-3 font-semibold text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/70 text-xs">
              {recentLogs.slice(0, 5).map((log) => {
                const isEntry = log.type === 'ENTRADA';

                return (
                  <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                          <img
                            src={`https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80`}
                            alt={log.fullName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80';
                            }}
                          />
                        </div>
                        <span className="font-bold text-slate-800 text-sm">
                          {log.fullName}
                        </span>
                      </div>
                    </td>

                    <td className="py-4">
                      <div className="font-medium text-slate-700">{log.role}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        CC {log.documentNumber}
                      </div>
                    </td>

                    <td className="py-4 font-medium text-slate-600">
                      {log.timestamp.includes('Hoy,') ? log.timestamp.replace('Hoy,', '').trim() : log.timestamp}
                    </td>

                    <td className="py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide ${
                        isEntry 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' 
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {isEntry ? (
                          <>
                            <span>→</span>
                            <span>ENTRADA</span>
                          </>
                        ) : (
                          <>
                            <span>←</span>
                            <span>SALIDA</span>
                          </>
                        )}
                      </span>
                    </td>

                    <td className="py-4 text-right">
                      <button 
                        onClick={() => alert(`Detalles del registro:\nUsuario: ${log.fullName}\nDocumento: ${log.documentNumber}\nPuerta: ${log.gate}\nOperador: ${log.celadorName}`)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
