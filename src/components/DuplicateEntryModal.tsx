import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, X, CheckCircle2 } from 'lucide-react';
import { User, AccessType } from '../types';
import { SenaLogo } from './SenaLogo';

interface DuplicateEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onForceConfirm: (reason: string) => void;
  user: User;
  attemptedType: AccessType;
}

export const DuplicateEntryModal: React.FC<DuplicateEntryModalProps> = ({
  isOpen,
  onClose,
  onForceConfirm,
  user,
  attemptedType
}) => {
  const [reason, setReason] = useState('Salida previa sin marcación en torniquete (Autorizado por Celador)');
  const [customReason, setCustomReason] = useState('');

  if (!isOpen) return null;

  const isDoubleEntry = attemptedType === 'ENTRADA' && user.accessStatus === 'EN_SEDE';
  const isDoubleExit = attemptedType === 'SALIDA' && user.accessStatus === 'FUERA_DE_SEDE';

  const title = isDoubleEntry
    ? '¡ALERTA DE SEGURIDAD: DOBLE ENTRADA CONSECUTIVA!'
    : '¡ALERTA DE SEGURIDAD: SALIDA SIN ENTRADA PREVIA!';

  const description = isDoubleEntry
    ? `El usuario ${user.fullName} (${user.roleLabel}) ya figura registrado como "EN SEDE". Registrar un nuevo ingreso consecutivo podría indicar carnet duplicado, préstamo indebido de credencial o error de flujo.`
    : `El usuario ${user.fullName} figura como "FUERA DE SEDE". Está intentando registrar una salida sin un registro previo de ingreso en el sistema.`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalReason = customReason.trim() || reason;
    onForceConfirm(finalReason);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border-2 border-amber-500 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-100 text-amber-700 rounded-xl">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <SenaLogo className="w-3.5 h-3.5" />
                <span className="text-xs font-bold text-amber-700 tracking-wider uppercase">
                  Control Institucional SENA
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-900 leading-tight mt-0.5">
                {title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User preview banner */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3 mb-4">
          <img
            src={user.photoUrl}
            alt={user.fullName}
            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs"
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-slate-800 text-sm truncate">{user.fullName}</h4>
            <div className="text-xs text-slate-500 flex items-center gap-2">
              <span>{user.documentType}: {user.documentNumber}</span>
              <span>•</span>
              <span className="text-slate-700 font-medium">{user.roleLabel}</span>
            </div>
          </div>
          <div className={`px-2.5 py-1 rounded-full text-xs font-bold ${
            user.accessStatus === 'EN_SEDE'
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-slate-200 text-slate-700'
          }`}>
            {user.accessStatus === 'EN_SEDE' ? 'En Sede' : 'Fuera'}
          </div>
        </div>

        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed mb-4 flex gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
          <p>{description}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Motivo de Excepción / Justificación de Celaduría
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:ring-2 focus:ring-[#39A900] focus:border-transparent outline-hidden"
            >
              <option value="Salida previa sin marcación en torniquete (Autorizado por Celador)">
                Salida previa sin marcación en torniquete
              </option>
              <option value="Falla técnica momentánea en lector de salida">
                Falla técnica momentánea en lector de salida
              </option>
              <option value="Reingreso justificado por comisión o salida médica autorizada">
                Reingreso justificado por comisión o salida médica
              </option>
              <option value="Otro">Otro motivo (Especificar abajo)</option>
            </select>
          </div>

          {reason === 'Otro' && (
            <div>
              <input
                type="text"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Escriba la justificación obligatoria..."
                required
                className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:ring-2 focus:ring-[#39A900] outline-hidden"
              />
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cancelar Operación
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-md transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              Forzar y Registrar con Novedad
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
