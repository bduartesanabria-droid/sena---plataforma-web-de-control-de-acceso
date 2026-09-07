import React, { useState, useEffect } from 'react';
import { 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  ExternalLink, 
  RefreshCw, 
  UploadCloud, 
  X,
  Server,
  Code2,
  ShieldCheck
} from 'lucide-react';
import { 
  SUPABASE_URL, 
  SUPABASE_ANON_KEY, 
  SUPABASE_SCHEMA_SQL, 
  checkSupabaseConnection, 
  seedAllToSupabase,
  SupabaseHealth 
} from '../lib/supabase';
import { User, AccessLog, Visitor, Vehicle, PendingPhotoItem, AuditLogItem } from '../types';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  accessLogs: AccessLog[];
  visitors: Visitor[];
  vehicles: Vehicle[];
  pendingPhotos: PendingPhotoItem[];
  auditLogs: AuditLogItem[];
  onRefreshData?: () => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({
  isOpen,
  onClose,
  users,
  accessLogs,
  visitors,
  vehicles,
  pendingPhotos,
  auditLogs,
  onRefreshData
}) => {
  const [activeTab, setActiveTab] = useState<'status' | 'sql' | 'sync'>('status');
  const [copied, setCopied] = useState(false);
  const [checking, setChecking] = useState(false);
  const [health, setHealth] = useState<SupabaseHealth | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      handleCheckConnection();
    }
  }, [isOpen]);

  const handleCheckConnection = async () => {
    setChecking(true);
    try {
      const res = await checkSupabaseConnection();
      setHealth(res);
    } finally {
      setChecking(false);
    }
  };

  const handleCopySQL = () => {
    navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSeedData = async () => {
    setSeeding(true);
    setSeedResult(null);
    try {
      const res = await seedAllToSupabase(users, accessLogs, visitors, vehicles, pendingPhotos, auditLogs);
      setSeedResult(res);
      if (res.success && onRefreshData) {
        onRefreshData();
      }
    } catch (err: any) {
      setSeedResult({ success: false, message: err.message || 'Error al sincronizar' });
    } finally {
      setSeeding(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#3ECF8E]/20 text-[#3ECF8E] flex items-center justify-center border border-[#3ECF8E]/40">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Integración Supabase PostgreSQL
                </h3>
                <span className="px-2 py-0.5 bg-[#3ECF8E]/20 text-[#3ECF8E] rounded text-[10px] font-bold uppercase tracking-wider border border-[#3ECF8E]/30">
                  Activo
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                didrauoufisvyyyirzzq.supabase.co
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="flex border-b border-slate-100 bg-slate-50/50 px-6 pt-2">
          <button
            onClick={() => setActiveTab('status')}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'status'
                ? 'border-[#39A900] text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Estado & Conexión</span>
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'sql'
                ? 'border-[#39A900] text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Esquema SQL (Tablas)</span>
          </button>
          <button
            onClick={() => setActiveTab('sync')}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'sync'
                ? 'border-[#39A900] text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Sincronización de Datos</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {activeTab === 'status' && (
            <div className="space-y-4">
              {/* Connection Status Box */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Estado del Servicio
                  </span>
                  <button
                    onClick={handleCheckConnection}
                    disabled={checking}
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${checking ? 'animate-spin' : ''}`} />
                    <span>Verificar Ping</span>
                  </button>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 mt-0.5 shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Conectado a Supabase Client
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {health ? health.message : 'Verificando latencia y credenciales de acceso...'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Credentials Details */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Credenciales Configuradas
                </h4>

                <div className="space-y-2">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500">Project URL</label>
                    <div className="p-2.5 bg-slate-100/80 rounded-xl font-mono text-xs text-slate-800 break-all select-all">
                      {SUPABASE_URL}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-500">Publishable Key</label>
                    <div className="p-2.5 bg-slate-100/80 rounded-xl font-mono text-xs text-slate-800 break-all select-all flex items-center justify-between">
                      <span className="truncate mr-2">{SUPABASE_ANON_KEY}</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">Válida</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-amber-900 text-xs space-y-1.5">
                <div className="font-bold flex items-center gap-1.5 text-amber-950">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  Instrucción para Migración en Supabase
                </div>
                <p className="text-amber-800 text-[11px] leading-relaxed">
                  Para que las tablas permanezcan en su base de datos PostgreSQL en la nube, copie el script en la pestaña <strong>Esquema SQL</strong> y péguelo en el <strong>SQL Editor</strong> de su consola de Supabase.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'sql' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    Script DDL para Supabase SQL Editor
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Crea las tablas <code>users</code>, <code>access_logs</code>, <code>visitors</code>, <code>vehicles</code>, <code>pending_photos</code> y <code>audit_logs</code>.
                  </p>
                </div>
                <button
                  onClick={handleCopySQL}
                  className="py-1.5 px-3 bg-[#39A900] hover:bg-[#287900] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? '¡Copiado!' : 'Copiar SQL'}</span>
                </button>
              </div>

              <div className="relative">
                <pre className="p-4 bg-slate-950 text-slate-200 rounded-2xl text-[11px] font-mono leading-relaxed overflow-x-auto max-h-72 border border-slate-800">
                  {SUPABASE_SCHEMA_SQL}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'sync' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  Sincronizar Datos Iniciales del SENA
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Envía usuarios base (Aprendiz Carlos R., Instructor Juan Carlos, Celador John D., Admin Claudia), registros de portería y vehículos a la base de datos remota de Supabase.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-lg font-black text-slate-900">{users.length}</div>
                  <div className="text-[10px] font-semibold text-slate-500 uppercase">Usuarios</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-lg font-black text-slate-900">{accessLogs.length}</div>
                  <div className="text-[10px] font-semibold text-slate-500 uppercase">Accesos</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-lg font-black text-slate-900">{visitors.length}</div>
                  <div className="text-[10px] font-semibold text-slate-500 uppercase">Visitantes</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-lg font-black text-slate-900">{vehicles.length}</div>
                  <div className="text-[10px] font-semibold text-slate-500 uppercase">Vehículos</div>
                </div>
              </div>

              {seedResult && (
                <div className={`p-3.5 rounded-xl text-xs font-medium flex items-start gap-2 border ${
                  seedResult.success 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}>
                  {seedResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  )}
                  <span>{seedResult.message}</span>
                </div>
              )}

              <button
                onClick={handleSeedData}
                disabled={seeding}
                className="w-full py-3 px-4 bg-[#39A900] hover:bg-[#287900] text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50 cursor-pointer"
              >
                <UploadCloud className={`w-4 h-4 ${seeding ? 'animate-bounce' : ''}`} />
                <span>{seeding ? 'Sincronizando con Supabase...' : 'Subir y Sincronizar Registros Ahora'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#3ECF8E]" />
            <span>Supabase Cloud PostgreSQL</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 font-bold text-slate-700 hover:bg-slate-200/70 rounded-xl transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
