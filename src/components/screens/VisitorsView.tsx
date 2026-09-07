import React, { useState } from 'react';
import { 
  User, 
  Car, 
  IdCard, 
  FileText, 
  Info, 
  Check, 
  QrCode, 
  Printer, 
  Download, 
  Sparkles,
  ShieldCheck,
  Building
} from 'lucide-react';
import { Barcode128 } from '../Barcode128';
import { Visitor, Vehicle } from '../../types';

interface VisitorsViewProps {
  onAddVisitor: (visitor: Visitor) => void;
  onAddVehicle: (vehicle: Vehicle) => void;
}

export const VisitorsView: React.FC<VisitorsViewProps> = ({
  onAddVisitor,
  onAddVehicle
}) => {
  const [activeMode, setActiveMode] = useState<'visitante' | 'vehiculo'>('visitante');

  // Visitor fields
  const [docNumber, setDocNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [reason, setReason] = useState('');
  const [hostArea, setHostArea] = useState('Coordinación Académica');

  // Vehicle fields
  const [plate, setPlate] = useState('');
  const [vehicleType, setVehicleType] = useState<'MOTO' | 'CARRO' | 'BICICLETA'>('MOTO');
  const [ownerDoc, setOwnerDoc] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [parkingSlot, setParkingSlot] = useState('Bahía Motos B-14');

  // Generated pass state
  const [generatedPass, setGeneratedPass] = useState<{
    code: string;
    title: string;
    subtitle: string;
    document: string;
    date: string;
  } | null>(null);

  const handleVisitorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docNumber || !fullName) return;

    const badgeCode = `VIS-${Math.floor(1000 + Math.random() * 9000)}`;
    const newVisitor: Visitor = {
      id: `vis-${Date.now()}`,
      documentNumber: docNumber,
      fullName: fullName,
      reason: reason || 'Gestión institucional',
      hostPersonOrArea: hostArea,
      entryDate: 'Hoy, ' + new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
      accessStatus: 'EN_SEDE',
      badgeCode
    };

    onAddVisitor(newVisitor);

    setGeneratedPass({
      code: badgeCode,
      title: fullName,
      subtitle: `Visitante • ${hostArea}`,
      document: `CC ${docNumber}`,
      date: new Date().toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
    });
  };

  const handleVehicleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plate || !ownerName) return;

    const newVeh: Vehicle = {
      id: `veh-${Date.now()}`,
      plate: plate.toUpperCase(),
      type: vehicleType,
      ownerDoc: ownerDoc || '9999999',
      ownerName: ownerName,
      parkingSlot,
      status: 'EN_SEDE',
      registeredAt: 'Hoy, ' + new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
    };

    onAddVehicle(newVeh);

    setGeneratedPass({
      code: `VEH-${plate.toUpperCase().replace(/\s/g, '')}`,
      title: `VEHÍCULO: ${plate.toUpperCase()}`,
      subtitle: `${vehicleType} • Bahía: ${parkingSlot}`,
      document: `Cond: ${ownerName} (${ownerDoc})`,
      date: new Date().toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
    });
  };

  const resetForm = () => {
    setDocNumber('');
    setFullName('');
    setReason('');
    setPlate('');
    setOwnerDoc('');
    setOwnerName('');
    setGeneratedPass(null);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Title section - Image 9 */}
      <div className="text-left">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
          Registro de Acceso
        </h2>
        <p className="text-xs text-slate-500 mt-1 max-w-xl">
          Ingrese los datos correspondientes para registrar un nuevo visitante o vehículo y generar su código de acceso seguro.
        </p>
      </div>

      {/* Mode Switcher Buttons - Image 9 */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            setActiveMode('visitante');
            setGeneratedPass(null);
          }}
          className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeMode === 'visitante'
              ? 'bg-[#1C7C00] text-white shadow-md shadow-[#1C7C00]/20'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Visitante</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveMode('vehiculo');
            setGeneratedPass(null);
          }}
          className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeMode === 'vehiculo'
              ? 'bg-[#1C7C00] text-white shadow-md shadow-[#1C7C00]/20'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Car className="w-4 h-4" />
          <span>Vehículo</span>
        </button>
      </div>

      {/* Main Registration Card - Exact replication of Image 9 */}
      <div className="bg-white rounded-3xl p-5 sm:p-8 md:p-10 shadow-xs border border-slate-200/80 relative overflow-hidden">
        {/* Subtle decorative shield watermark on right */}
        <div className="absolute right-6 top-8 text-slate-100 pointer-events-none hidden sm:block">
          <ShieldCheck className="w-32 h-32 opacity-40" />
        </div>

        {activeMode === 'visitante' ? (
          <form onSubmit={handleVisitorSubmit} className="space-y-6 relative z-10">
            {/* Documento de Identidad */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                Documento de Identidad
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-3.5 text-slate-400">
                  <IdCard className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={docNumber}
                  onChange={(e) => setDocNumber(e.target.value)}
                  placeholder="Ej: 1234567890"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-[#39A900] outline-hidden font-medium"
                />
              </div>
            </div>

            {/* Nombre Completo */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                Nombre Completo
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-3.5 text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nombres y Apellidos"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-[#39A900] outline-hidden font-medium"
                />
              </div>
            </div>

            {/* Motivo de la Visita */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                Motivo de la Visita
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-3.5 text-slate-400">
                  <FileText className="w-4 h-4" />
                </div>
                <textarea
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Especifique el área o persona a visitar..."
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-[#39A900] outline-hidden font-medium resize-none"
                />
              </div>
            </div>

            {/* Info Notice Box - Image 9 */}
            <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex items-center gap-3 text-xs text-amber-900 font-medium">
              <div className="p-1 text-amber-600 shrink-0">
                <Info className="w-4 h-4" />
              </div>
              <p>Se requerirá presentar el documento en físico al momento del ingreso.</p>
            </div>

            {/* Submit Button - Image 9 */}
            <button
              type="submit"
              className="w-full py-3.5 px-6 bg-[#39A900] hover:bg-[#2e8800] active:scale-[0.99] text-white font-bold rounded-2xl shadow-md shadow-[#39A900]/25 transition-all flex items-center justify-center gap-2.5 text-sm cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
              <span>Guardar y Generar Código</span>
            </button>
          </form>
        ) : (
          /* Vehicle Form */
          <form onSubmit={handleVehicleSubmit} className="space-y-6 relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Placa del Vehículo
                </label>
                <input
                  type="text"
                  value={plate}
                  onChange={(e) => setPlate(e.target.value)}
                  placeholder="Ej: KLU-892"
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-mono font-bold tracking-wider uppercase focus:bg-white focus:ring-2 focus:ring-[#39A900] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Tipo de Vehículo
                </label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value as 'MOTO' | 'CARRO' | 'BICICLETA')}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-semibold focus:bg-white focus:ring-2 focus:ring-[#39A900] outline-hidden"
                >
                  <option value="MOTO">Moto</option>
                  <option value="CARRO">Carro / Automóvil</option>
                  <option value="BICICLETA">Bicicleta / Patineta</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Documento Conductor
                </label>
                <input
                  type="text"
                  value={ownerDoc}
                  onChange={(e) => setOwnerDoc(e.target.value)}
                  placeholder="C.C. Conductor"
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#39A900] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Nombre Conductor / Propietario
                </label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="Nombres y Apellidos"
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#39A900] outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                Bahía / Espacio Asignado
              </label>
              <input
                type="text"
                value={parkingSlot}
                onChange={(e) => setParkingSlot(e.target.value)}
                placeholder="Bahía Asignada"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#39A900] outline-hidden"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 bg-[#39A900] hover:bg-[#2e8800] text-white font-bold rounded-2xl shadow-md shadow-[#39A900]/25 transition-all flex items-center justify-center gap-2.5 text-sm cursor-pointer"
            >
              <Car className="w-4 h-4" />
              <span>Guardar y Asignar Pase de Vehículo</span>
            </button>
          </form>
        )}

        {/* Footer Subtext from Image 9 */}
        <div className="mt-8 pt-4 border-t border-slate-100 text-center">
          <span className="text-[11px] text-slate-400 font-medium">
            SENA Acceso Seguro V2.1
          </span>
        </div>
      </div>

      {/* Generated Access Pass Modal / Card */}
      {generatedPass && (
        <div className="bg-emerald-50/80 border-2 border-[#39A900] rounded-3xl p-6 shadow-xl animate-in zoom-in-95 duration-200 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-600 text-white rounded-full text-xs font-bold">
            <Check className="w-4 h-4" />
            <span>Código de Acceso Generado Exitosamente</span>
          </div>

          <div className="max-w-sm mx-auto bg-white p-6 rounded-2xl border border-slate-200 shadow-md">
            <div className="text-[11px] font-bold text-[#39A900] tracking-widest uppercase mb-1">
              SENA • Control de Acceso
            </div>
            <h3 className="text-lg font-black text-slate-900">{generatedPass.title}</h3>
            <p className="text-xs text-slate-500 mb-4">{generatedPass.subtitle}</p>

            {/* Authentic Code128 barcode for the pass */}
            <div className="py-2 bg-slate-50 rounded-xl border border-slate-100 flex justify-center">
              <Barcode128
                value={generatedPass.code}
                text={generatedPass.code}
                height={50}
                width={1.7}
              />
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 flex justify-between">
              <span>{generatedPass.document}</span>
              <span>{generatedPass.date}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir Pase</span>
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 bg-[#39A900] hover:bg-[#2e8800] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Nuevo Registro
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
