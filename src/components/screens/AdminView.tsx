import React, { useState } from 'react';
import { 
  Users, 
  Camera, 
  Car, 
  ShieldCheck, 
  ArrowRight, 
  Check, 
  X, 
  AlertTriangle, 
  UserCheck, 
  Lock, 
  RefreshCw,
  Clock,
  Sparkles,
  Database,
  Code2,
  ExternalLink
} from 'lucide-react';
import { AuditLogItem, PendingPhotoItem } from '../../types';

interface AdminViewProps {
  auditLogs: AuditLogItem[];
  pendingPhotos: PendingPhotoItem[];
  onApprovePhoto: (item: PendingPhotoItem) => void;
  onRejectPhoto: (item: PendingPhotoItem, reason: string) => void;
  totalEntriesToday: number;
  vehiclesCount: number;
  onOpenSupabaseModal?: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  auditLogs,
  pendingPhotos,
  onApprovePhoto,
  onRejectPhoto,
  totalEntriesToday,
  vehiclesCount,
  onOpenSupabaseModal
}) => {
  const [rejectingItem, setRejectingItem] = useState<PendingPhotoItem | null>(null);
  const [rejectReason, setRejectReason] = useState('Foto borrosa o rostro no visible claramente');

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (rejectingItem) {
      onRejectPhoto(rejectingItem, rejectReason);
      setRejectingItem(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header - Image 15 */}
      <div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
          Panel de Administración
        </h2>
        <p className="text-xs text-slate-500 mt-1 max-w-2xl">
          Gestión de usuarios, auditoría del sistema y revisión de credenciales de acceso para la sede SENA.
        </p>
      </div>

      {/* 4 Stat Cards Row - Exact Match to Image 15 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Ingresos Registrados */}
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
            <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-bold uppercase tracking-wider">
              HOY
            </span>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900">1,245</div>
            <div className="text-xs font-semibold text-slate-500 mt-1">Ingresos Registrados</div>
          </div>
        </div>

        {/* Card 2: Fotos por Revisar */}
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute bottom-0 inset-x-0 h-1 bg-amber-500" />
          <div className="flex items-center justify-between mb-4">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 rounded-md text-[10px] font-bold uppercase tracking-wider">
              URGENTE
            </span>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900">{pendingPhotos.length}</div>
            <div className="text-xs font-semibold text-slate-500 mt-1">Fotos por Revisar</div>
          </div>
        </div>

        {/* Card 3: Vehículos en Parqueadero */}
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Car className="w-4 h-4" />
            </div>
            <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-bold uppercase tracking-wider">
              HOY
            </span>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900">{vehiclesCount || 128}</div>
            <div className="text-xs font-semibold text-slate-500 mt-1">Vehículos en Parqueadero</div>
          </div>
        </div>

        {/* Card 4: Efectividad Escáner (Green Solid Card - Image 15) */}
        <div className="bg-gradient-to-br from-[#1C7C00] to-[#145C00] text-white rounded-3xl p-6 shadow-md shadow-emerald-950/10 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="w-8 h-8 rounded-xl bg-white/20 text-white flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse ring-4 ring-emerald-400/30" />
          </div>
          <div>
            <div className="text-3xl font-black text-white">99.8%</div>
            <div className="text-xs font-bold text-white/85 mt-1">Efectividad Escáner</div>
          </div>
        </div>
      </div>

      {/* Supabase Database Integration Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-md border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#3ECF8E]/20 text-[#3ECF8E] flex items-center justify-center border border-[#3ECF8E]/30 shrink-0">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-tight">
                Base de Datos PostgreSQL (Supabase)
              </h3>
              <span className="px-2 py-0.5 bg-[#3ECF8E]/20 text-[#3ECF8E] rounded text-[10px] font-bold uppercase tracking-wider border border-[#3ECF8E]/30">
                Conectado
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              https://didrauoufisvyyyirzzq.supabase.co
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {onOpenSupabaseModal && (
            <button
              onClick={onOpenSupabaseModal}
              className="w-full sm:w-auto px-4 py-2.5 bg-[#39A900] hover:bg-[#287900] text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <Code2 className="w-4 h-4" />
              <span>Ver Esquema SQL & Sincronizar</span>
            </button>
          )}
        </div>
      </div>

      {/* Two Column Layout: Auditoría Reciente & Pendientes Foto - Image 15 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Auditoría Reciente (Image 15) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-7 shadow-xs border border-slate-200/80">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-100">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              Auditoría Reciente
            </h3>
            <button 
              onClick={() => alert('Exportando registro completo de auditoría de seguridad...')}
              className="text-xs font-bold text-[#39A900] hover:text-[#287900] flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>Ver todo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {auditLogs.map((log) => {
              const isBlocked = log.status === 'Bloqueado';
              const isAuto = log.status === 'Automático';

              return (
                <div 
                  key={log.id} 
                  className="p-3.5 rounded-2xl hover:bg-slate-50 border border-slate-100 transition-colors flex items-start gap-4"
                >
                  <div className={`p-2 rounded-xl mt-0.5 shrink-0 ${
                    isBlocked 
                      ? 'bg-rose-50 text-rose-600' 
                      : isAuto 
                      ? 'bg-slate-100 text-slate-600' 
                      : 'bg-emerald-50 text-emerald-600'
                  }`}>
                    {isBlocked ? (
                      <AlertTriangle className="w-4 h-4" />
                    ) : isAuto ? (
                      <RefreshCw className="w-4 h-4" />
                    ) : (
                      <ShieldCheck className="w-4 h-4" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-black text-slate-900 truncate">
                        {log.title}
                      </h4>
                      <span className="text-[11px] font-medium text-slate-400 shrink-0">
                        {log.time}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1 font-medium">
                      {log.description}
                    </p>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    isBlocked 
                      ? 'bg-rose-100 text-rose-800' 
                      : isAuto 
                      ? 'bg-slate-200 text-slate-700' 
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {log.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Pendientes Foto Queue (Image 15) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-7 shadow-xs border border-slate-200/80">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-amber-500" />
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Pendientes Foto
              </h3>
            </div>
            <span className="px-2.5 py-0.5 bg-amber-500 text-white rounded-full text-xs font-black">
              {pendingPhotos.length}
            </span>
          </div>

          {pendingPhotos.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              <ShieldCheck className="w-8 h-8 mx-auto text-emerald-500 mb-2" />
              ¡Excelente! No hay fotos pendientes de revisión. Todos los carnets están al día.
            </div>
          ) : (
            <div className="space-y-4">
              {pendingPhotos.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.photoUrl}
                      alt={item.fullName}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0 bg-white"
                    />

                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-black text-slate-900 truncate">
                        {item.fullName}
                      </h4>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {item.documentNumber}
                      </div>
                      <div className="text-[10px] font-bold text-emerald-700 tracking-wider uppercase mt-0.5">
                        {item.fichaOrInfo}
                      </div>
                    </div>
                  </div>

                  {item.warning && (
                    <div className="p-2 bg-rose-50 border border-rose-200 rounded-lg text-[11px] font-bold text-rose-800 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>{item.warning}</span>
                    </div>
                  )}

                  {/* Approve / Reject buttons from Image 15 */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => onApprovePhoto(item)}
                      className="flex-1 py-2 px-3 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Aprobar</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRejectingItem(item)}
                      className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl transition-colors cursor-pointer"
                      title="Rechazar fotografía"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 pt-3 border-t border-slate-100 text-center">
            <span className="text-xs font-bold text-slate-500 hover:text-[#39A900] cursor-pointer">
              Ver todas las pendientes ({pendingPhotos.length})
            </span>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {rejectingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Rechazar Fotografía de {rejectingItem.fullName}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Indique el motivo por el cual la foto no cumple los criterios biométricos institucionales. Se notificará al usuario para que cargue una nueva.
            </p>

            <form onSubmit={handleConfirmReject} className="space-y-4">
              <select
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-rose-500 outline-hidden font-medium"
              >
                <option value="Foto borrosa o rostro no visible claramente">Foto borrosa o desenfocada</option>
                <option value="Fondo no es blanco / Distractores en imagen">Fondo no es blanco / Distractores</option>
                <option value="Uso de gorra, gafas oscuras o accesorios restrictivos">Uso de gorra, gafas oscuras o accesorios</option>
                <option value="Foto inclinada o recorte incorrecto">Foto inclinada o recorte incorrecto</option>
              </select>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectingItem(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md cursor-pointer"
                >
                  Confirmar Rechazo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
