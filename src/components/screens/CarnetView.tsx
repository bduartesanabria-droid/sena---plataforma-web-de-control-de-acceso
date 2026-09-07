import React, { useState, useRef, useEffect } from 'react';
import { 
  Download, 
  Camera, 
  Info, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Upload, 
  Printer, 
  RefreshCw,
  Sparkles,
  Smartphone,
  RotateCw
} from 'lucide-react';
import { Barcode128 } from '../Barcode128';
import { SenaLogo } from '../SenaLogo';
import { User } from '../../types';

interface CarnetViewProps {
  currentUser: User;
  onPhotoUploaded: (userId: string, photoUrl: string) => void;
}

export const CarnetView: React.FC<CarnetViewProps> = ({
  currentUser,
  onPhotoUploaded
}) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [photoSourceMode, setPhotoSourceMode] = useState<'camera' | 'file'>('camera');
  const [selectedPhotoPreview, setSelectedPhotoPreview] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [webcamActive, setWebcamActive] = useState(false);
  const [webcamLoading, setWebcamLoading] = useState(false);
  const [webcamError, setWebcamError] = useState<string | null>(null);

  const webcamVideoRef = useRef<HTMLVideoElement | null>(null);
  const webcamStreamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Stop webcam stream safely
  const stopWebcam = () => {
    if (webcamStreamRef.current) {
      webcamStreamRef.current.getTracks().forEach(track => track.stop());
      webcamStreamRef.current = null;
    }
    if (webcamVideoRef.current) {
      webcamVideoRef.current.srcObject = null;
    }
    setWebcamActive(false);
    setWebcamLoading(false);
  };

  // Start webcam for photo capture
  const startWebcam = async () => {
    setWebcamLoading(true);
    setWebcamError(null);

    stopWebcam();

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setWebcamError('Tu navegador o dispositivo no soporta acceso directo a cámara.');
      setWebcamLoading(false);
      return;
    }

    try {
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: 640 },
            height: { ideal: 640 }
          },
          audio: false
        });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
      }

      webcamStreamRef.current = stream;

      if (webcamVideoRef.current) {
        webcamVideoRef.current.srcObject = stream;
        try {
          await webcamVideoRef.current.play();
        } catch (e) {
          console.warn('Webcam video play was prevented:', e);
        }
      }

      setWebcamActive(true);
      setWebcamLoading(false);
    } catch (err: any) {
      console.warn('Webcam capture error:', err);
      setWebcamActive(false);
      setWebcamLoading(false);
      let msg = 'No fue posible acceder a la cámara web.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        msg = 'Permiso denegado: por favor permite el acceso a la cámara en tu navegador.';
      }
      setWebcamError(msg);
    }
  };

  // Capture frame from webcam into canvas
  const handleCaptureFromWebcam = () => {
    if (!webcamVideoRef.current || !canvasRef.current) return;
    const video = webcamVideoRef.current;
    const canvas = canvasRef.current;
    
    // Set 400x400 square crop
    const size = Math.min(video.videoWidth || 400, video.videoHeight || 400);
    canvas.width = 400;
    canvas.height = 400;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const startX = (video.videoWidth - size) / 2;
      const startY = (video.videoHeight - size) / 2;
      ctx.drawImage(video, startX, startY, size, size, 0, 0, 400, 400);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      setSelectedPhotoPreview(dataUrl);
      stopWebcam();
    }
  };

  // Manage webcam lifecycle with modal
  useEffect(() => {
    if (showUploadModal && photoSourceMode === 'camera' && !selectedPhotoPreview) {
      startWebcam();
    } else {
      stopWebcam();
    }

    return () => {
      stopWebcam();
    };
  }, [showUploadModal, photoSourceMode, selectedPhotoPreview]);

  // Carnet status
  const isActive = currentUser.carnetStatus === 'ACTIVO';
  const isPending = currentUser.carnetStatus === 'PENDIENTE_FOTO';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedPhotoPreview(event.target?.result as string);
        stopWebcam();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmUpload = () => {
    if (selectedPhotoPreview) {
      onPhotoUploaded(currentUser.id, selectedPhotoPreview);
      setUploadSuccess(true);
      setTimeout(() => {
        setUploadSuccess(false);
        setShowUploadModal(false);
        setSelectedPhotoPreview(null);
      }, 1500);
    }
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Title & Status Header - Image 13 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Mi Carnet Digital
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Identificación oficial para acceso a instalaciones SENA.
          </p>
        </div>

        {/* Status Badge */}
        <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider self-start sm:self-auto ${
          isActive 
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
            : isPending
            ? 'bg-amber-50 text-amber-800 border border-amber-200'
            : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          <span className={`w-2 h-2 rounded-full ${
            isActive ? 'bg-emerald-500 animate-pulse' : isPending ? 'bg-amber-500' : 'bg-rose-500'
          }`} />
          <span>ESTADO: {currentUser.carnetStatus}</span>
        </div>
      </div>

      {/* Official SENA Carnet Card - Exact Layout from Image 13 */}
      <div className="flex justify-center py-2">
        <div 
          id="sena-carnet-card"
          className="w-full max-w-[340px] bg-white rounded-3xl shadow-xl shadow-slate-200/70 border border-slate-200/90 overflow-hidden flex flex-col justify-between p-6 relative transition-all hover:shadow-2xl"
          style={{ minHeight: '510px' }}
        >
          {/* Subtle gradient background banner */}
          <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-emerald-50/70 to-transparent pointer-events-none" />

          {/* Authentic SENA watermark in card background */}
          <div className="absolute -right-8 bottom-12 opacity-[0.06] pointer-events-none select-none">
            <SenaLogo className="w-56 h-56" />
          </div>

          {/* Top Header Row: Official SENA Emblem on left + Republic of Colombia text on right */}
          <div className="flex items-start justify-between relative z-10">
            <div className="p-2 sm:p-2.5 bg-white/95 rounded-2xl shadow-xs border border-slate-100 flex items-center justify-center">
              <SenaLogo className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>

            <div className="text-right leading-tight">
              <div className="text-[10px] sm:text-[11px] font-black text-[#1C7C00] tracking-wider uppercase">
                REPÚBLICA DE COLOMBIA
              </div>
              <div className="text-[10px] font-bold text-slate-500">
                Ministerio del Trabajo
              </div>
            </div>
          </div>

          {/* Center Column: Photo, Name, Role, Regional */}
          <div className="flex flex-col items-center text-center my-4 relative z-10">
            {/* Circular Photo */}
            <div className="relative mb-4">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg shadow-slate-300/60 bg-slate-100">
                <img
                  src={currentUser.photoUrl}
                  alt={currentUser.fullName}
                  className="w-full h-full object-cover"
                />
              </div>

              {isActive && (
                <div className="absolute bottom-1 right-1 p-1 bg-[#39A900] text-white rounded-full ring-2 ring-white shadow-xs">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              )}
            </div>

            {/* Name */}
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight max-w-[260px] leading-tight">
              {currentUser.fullName}
            </h3>

            {/* Role in Green */}
            <div className="text-sm font-bold text-[#39A900] mt-1">
              {currentUser.roleLabel}
            </div>

            {/* Ficha / Program info */}
            {currentUser.ficha && (
              <div className="text-xs font-semibold text-slate-700 mt-0.5">
                Ficha: {currentUser.ficha}
              </div>
            )}

            {/* Regional & Centro */}
            <div className="text-[11px] text-slate-500 mt-2 font-medium leading-relaxed">
              <div>{currentUser.regional}</div>
              <div>{currentUser.centro}</div>
            </div>
          </div>

          {/* Bottom Row: Code128 Barcode & Document Number */}
          <div className="pt-2 border-t border-slate-100 flex flex-col items-center justify-center relative z-10">
            {isActive ? (
              <div className="w-full flex flex-col items-center bg-white py-1">
                <Barcode128
                  value={currentUser.barcodeCode128}
                  text={`CC ${currentUser.documentNumber.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`}
                  height={50}
                  width={1.6}
                  fontSize={11}
                />
              </div>
            ) : (
              <div className="p-3 bg-amber-50 rounded-xl text-center text-amber-800 text-xs w-full">
                <AlertTriangle className="w-4 h-4 mx-auto text-amber-600 mb-1" />
                <span className="font-bold">Código Bloqueado Temporalmente</span>
                <p className="text-[10px] text-amber-700 mt-0.5">
                  Pendiente de validación de fotografía por el Administrador.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons: Descargar PDF & Subir Foto - Image 13 */}
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={handleDownloadPDF}
          className="px-6 py-2.5 bg-[#39A900] hover:bg-[#2e8800] active:scale-[0.99] text-white text-xs font-bold rounded-xl shadow-md shadow-[#39A900]/25 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Descargar PDF</span>
        </button>

        <button
          type="button"
          onClick={() => setShowUploadModal(true)}
          className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-2 cursor-pointer border border-slate-200"
        >
          <Camera className="w-4 h-4 text-slate-500" />
          <span>Subir Foto</span>
        </button>
      </div>

      {/* Instrucciones de Uso Card - Image 13 */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 text-xs text-slate-600 space-y-3">
        <div className="flex items-center gap-2 text-slate-800 font-bold">
          <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs">
            <Info className="w-3.5 h-3.5" />
          </div>
          <span>Instrucciones de Uso</span>
        </div>

        <ul className="space-y-2 text-slate-600 pl-1 leading-relaxed">
          <li className="flex items-start gap-2">
            <span className="text-slate-400">•</span>
            <span>Aumente el brillo de su pantalla al máximo antes de presentar el código de barras en portería.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-slate-400">•</span>
            <span>Este carnet es personal e intransferible.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-slate-400">•</span>
            <span>En caso de pérdida de su dispositivo, repórtelo inmediatamente en la plataforma web para inactivar el código actual.</span>
          </li>
        </ul>
      </div>

      {/* Upload Photo Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">Actualizar Fotografía Institucional</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {uploadSuccess ? (
              <div className="p-6 text-center space-y-2">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Foto Enviada a Revisión</h4>
                <p className="text-xs text-slate-500">
                  Su fotografía ha sido remitida a la bandeja del Administrador para verificación biométrica y aprobación.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Source Selection Tabs */}
                {!selectedPhotoPreview && (
                  <div className="flex rounded-xl bg-slate-100 p-1">
                    <button
                      type="button"
                      onClick={() => setPhotoSourceMode('camera')}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                        photoSourceMode === 'camera' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      <Camera className="w-3.5 h-3.5 text-[#39A900]" />
                      <span>Usar Cámara Web</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPhotoSourceMode('file')}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                        photoSourceMode === 'file' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      <Upload className="w-3.5 h-3.5 text-slate-600" />
                      <span>Subir Archivo</span>
                    </button>
                  </div>
                )}

                {/* Preview or Capture Viewport */}
                {selectedPhotoPreview ? (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-3">
                    <div className="relative inline-block">
                      <img
                        src={selectedPhotoPreview}
                        alt="Previsualización"
                        className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-white shadow-lg"
                      />
                      <div className="absolute bottom-0 right-0 p-1 bg-emerald-500 rounded-full text-white ring-2 ring-white">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-emerald-800 font-bold block">
                        Fotografía lista para validación
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPhotoPreview(null);
                          if (photoSourceMode === 'camera') startWebcam();
                        }}
                        className="text-xs text-slate-500 hover:text-[#39A900] font-semibold underline mt-1 cursor-pointer"
                      >
                        Repetir fotografía
                      </button>
                    </div>
                  </div>
                ) : photoSourceMode === 'camera' ? (
                  /* Camera Mode */
                  <div className="relative aspect-square max-w-[280px] mx-auto rounded-3xl overflow-hidden bg-slate-950 flex items-center justify-center border-2 border-emerald-500/40 shadow-inner">
                    <video
                      ref={webcamVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />

                    {/* Facial Oval Guideline */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-6">
                      <div className="w-40 h-48 border-2 border-dashed border-emerald-400/80 rounded-full shadow-[0_0_15px_rgba(52,211,153,0.3)]" />
                    </div>

                    {/* Camera Control overlay */}
                    <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-2 z-10">
                      {webcamActive ? (
                        <button
                          type="button"
                          onClick={handleCaptureFromWebcam}
                          className="px-4 py-2 bg-[#39A900] hover:bg-[#2e8800] text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                        >
                          <Camera className="w-4 h-4" />
                          <span>Tomar Fotografía</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={startWebcam}
                          disabled={webcamLoading}
                          className="px-4 py-2 bg-white text-slate-900 font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5 cursor-pointer"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${webcamLoading ? 'animate-spin' : ''}`} />
                          <span>{webcamLoading ? 'Iniciando...' : 'Reconectar Cámara'}</span>
                        </button>
                      )}
                    </div>

                    {webcamError && (
                      <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center p-4 text-center z-20">
                        <AlertTriangle className="w-8 h-8 text-amber-400 mb-2" />
                        <p className="text-xs text-white font-medium mb-3">{webcamError}</p>
                        <button
                          type="button"
                          onClick={startWebcam}
                          className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold cursor-pointer"
                        >
                          Reintentar Acceso
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  /* File Upload Mode */
                  <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-[#39A900] transition-colors relative bg-slate-50/50">
                    <div className="space-y-2">
                      <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#39A900] flex items-center justify-center mx-auto">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div className="text-xs font-bold text-slate-700">
                        Haga clic o arrastre una fotografía formal
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Fondo blanco, plano medio de frente (JPG o PNG)
                      </div>
                    </div>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                )}

                {/* Hidden canvas for taking snapshot from webcam */}
                <canvas ref={canvasRef} className="hidden" />

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                  <span className="font-bold">Regla Institucional: </span>
                  El carnet permanecerá inactivo hasta que el Administrador de Sede verifique y apruebe la fotografía.
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      stopWebcam();
                      setShowUploadModal(false);
                      setSelectedPhotoPreview(null);
                    }}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmUpload}
                    disabled={!selectedPhotoPreview}
                    className="px-5 py-2 text-xs font-bold text-white bg-[#39A900] hover:bg-[#2e8800] disabled:opacity-40 rounded-xl shadow-md cursor-pointer"
                  >
                    Enviar a Aprobación
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
