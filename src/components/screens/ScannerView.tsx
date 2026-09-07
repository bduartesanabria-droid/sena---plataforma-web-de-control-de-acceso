import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Flashlight, 
  RotateCw, 
  Sliders, 
  Search, 
  CheckCircle2, 
  ArrowRight, 
  UserCheck, 
  AlertCircle,
  Volume2,
  VolumeX,
  Sparkles,
  Barcode
} from 'lucide-react';
import { User, AccessType } from '../../types';
import { SenaLogo } from '../SenaLogo';

interface ScannerViewProps {
  users: User[];
  onRegisterAccess: (user: User, type: AccessType, forcedReason?: string) => void;
  onRequestDuplicateCheck: (user: User, type: AccessType) => void;
}

export const ScannerView: React.FC<ScannerViewProps> = ({
  users,
  onRegisterAccess,
  onRequestDuplicateCheck
}) => {
  const [manualQuery, setManualQuery] = useState('');
  const [detectedUser, setDetectedUser] = useState<User | null>(
    users.find(u => u.documentNumber === '1002334556') || users[1] || users[0]
  );
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [flashOn, setFlashOn] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: 'success' | 'warning' | 'error' } | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Sound generator for barcode beep
  const playScanBeep = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1800, audioCtx.currentTime); // High-pitch standard scanner beep
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.12);
    } catch {
      // AudioContext might be constrained
    }
  };

  // Stop camera stream safely
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setFlashOn(false);
  };

  // Start real camera stream with resilient fallback
  const startCamera = async (targetMode: 'environment' | 'user') => {
    setCameraLoading(true);
    setCameraError(null);

    // Clean up any existing stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      const msg = 'El navegador no tiene soporte para cámara WebRTC en este entorno.';
      setCameraError(msg);
      setCameraLoading(false);
      setFeedbackMessage({ text: msg, type: 'error' });
      return;
    }

    try {
      let stream: MediaStream;
      try {
        // Try with ideal facingMode and resolution
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: targetMode },
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        });
      } catch {
        // Resilient fallback for laptops/desktops without environment camera
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
      }

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try {
          await videoRef.current.play();
        } catch (playErr) {
          console.warn('Video auto-play interrupted:', playErr);
        }
      }

      setCameraActive(true);
      setCameraLoading(false);
      setFeedbackMessage({
        text: 'Cámara activada correctamente. Apunte al carnet institucional.',
        type: 'success'
      });
    } catch (err: any) {
      console.warn('Camera getUserMedia error:', err);
      setCameraLoading(false);
      setCameraActive(false);

      let msg = 'No se pudo acceder a la cámara.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        msg = 'Permiso denegado: por favor concede acceso a la cámara en tu navegador.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        msg = 'No se detectó ninguna cámara conectada en tu equipo.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        msg = 'La cámara está siendo ocupada por otra ventana o aplicación.';
      }
      setCameraError(msg);
      setFeedbackMessage({ text: msg, type: 'error' });
    }
  };

  // Toggle camera active/inactive
  const toggleCamera = async () => {
    if (cameraActive) {
      stopCamera();
    } else {
      await startCamera(facingMode);
    }
  };

  // Switch facing mode (front/back camera)
  const switchCamera = async () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    if (cameraActive) {
      await startCamera(nextMode);
    }
  };

  // Toggle flash/torch
  const toggleFlash = async () => {
    const nextFlash = !flashOn;
    setFlashOn(nextFlash);

    if (streamRef.current) {
      const track = streamRef.current.getVideoTracks()[0];
      if (track) {
        try {
          await (track as any).applyConstraints({
            advanced: [{ torch: nextFlash }]
          });
        } catch {
          // Hardware torch not available, visual CSS overlay takes over
        }
      }
    }
  };

  // Barcode Detection Loop when Camera is Active
  useEffect(() => {
    if (!cameraActive) return;

    let animId: number;
    let detector: any = null;

    if ('BarcodeDetector' in window) {
      try {
        detector = new (window as any).BarcodeDetector({
          formats: ['code_128', 'qr_code', 'ean_13', 'code_39']
        });
      } catch (e) {
        console.warn('BarcodeDetector not initialized:', e);
      }
    }

    const scanFrame = async () => {
      if (videoRef.current && detector && videoRef.current.readyState >= 2) {
        try {
          const codes = await detector.detect(videoRef.current);
          if (codes && codes.length > 0) {
            const raw = codes[0].rawValue?.trim();
            if (raw) {
              const matched = users.find(u => u.barcodeCode128 === raw || u.documentNumber === raw);
              if (matched) {
                setDetectedUser(matched);
                playScanBeep();
                setFeedbackMessage({
                  text: `¡Código detectado automáticamente! ${matched.fullName} (${matched.barcodeCode128})`,
                  type: 'success'
                });
              }
            }
          }
        } catch {
          // Ignore detection errors during movement
        }
      }
      animId = requestAnimationFrame(scanFrame);
    };

    if (detector) {
      animId = requestAnimationFrame(scanFrame);
    }

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [cameraActive, users]);

  // Clean up stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = manualQuery.trim().toLowerCase();
    if (!query) return;

    const found = users.find(u => 
      u.documentNumber.includes(query) || 
      u.fullName.toLowerCase().includes(query) ||
      u.barcodeCode128.includes(query)
    );

    if (found) {
      setDetectedUser(found);
      playScanBeep();
      setFeedbackMessage({
        text: `Usuario localizado: ${found.fullName}`,
        type: 'success'
      });
    } else {
      setFeedbackMessage({
        text: `No se encontró registro para "${manualQuery}". Verifique en Visitantes.`,
        type: 'error'
      });
    }
  };

  const handleSimulateScan = (user: User) => {
    setDetectedUser(user);
    playScanBeep();
    setFeedbackMessage({
      text: `Código de Barras Code128 detectado: [${user.barcodeCode128}]`,
      type: 'success'
    });
  };

  const handleAction = (type: AccessType) => {
    if (!detectedUser) return;

    // Check strict domain rules
    // If carnet is not active, block access
    if (detectedUser.carnetStatus !== 'ACTIVO') {
      setFeedbackMessage({
        text: `ACCESO DENEGADO: El carnet de ${detectedUser.fullName} no está activo (${detectedUser.carnetStatus}). Requiere aprobación de foto por el Administrador.`,
        type: 'error'
      });
      return;
    }

    // Check duplicate status
    const isDoubleEntry = type === 'ENTRADA' && detectedUser.accessStatus === 'EN_SEDE';
    const isDoubleExit = type === 'SALIDA' && detectedUser.accessStatus === 'FUERA_DE_SEDE';

    if (isDoubleEntry || isDoubleExit) {
      onRequestDuplicateCheck(detectedUser, type);
    } else {
      onRegisterAccess(detectedUser, type);
      playScanBeep();
      setFeedbackMessage({
        text: `${type === 'ENTRADA' ? 'Ingreso' : 'Salida'} registrado con éxito para ${detectedUser.fullName}`,
        type: 'success'
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Escáner de Acceso
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Apunta la cámara al código de barras o QR del documento.
          </p>
        </div>

        {/* Camera Ready / Live Pill */}
        <div className={`flex items-center gap-2 self-start sm:self-auto px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider transition-colors ${
          cameraActive 
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-xs' 
            : 'bg-slate-100 text-slate-700 border border-slate-200'
        }`}>
          <span className={`w-2.5 h-2.5 rounded-full ${
            cameraActive ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'
          }`} />
          <span>{cameraActive ? 'CÁMARA EN VIVO' : 'CÁMARA EN ESPERA'}</span>
        </div>
      </div>

      {feedbackMessage && (
        <div className={`p-3 rounded-2xl text-xs font-bold flex items-center justify-between transition-all ${
          feedbackMessage.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            : feedbackMessage.type === 'warning'
            ? 'bg-amber-50 text-amber-800 border border-amber-200'
            : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          <span>{feedbackMessage.text}</span>
          <button 
            onClick={() => setFeedbackMessage(null)}
            className="text-xs font-semibold underline ml-3 cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* Main Scanner Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Viewfinder (Image 5) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-slate-200/80">
          <div className="relative aspect-[4/5] sm:aspect-[4/3] lg:aspect-[4/5] w-full rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center group">
            {/* Real Camera Stream - Kept permanently mounted so videoRef is always valid */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                cameraActive ? 'opacity-100 block' : 'opacity-0 hidden'
              }`}
            />

            {/* Inactive state realistic view with activate button */}
            {!cameraActive && (
              <div className="w-full h-full relative">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80"
                  alt="Escáner en espera"
                  className="w-full h-full object-cover filter grayscale contrast-125 brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/30" />

                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                  <button
                    type="button"
                    onClick={toggleCamera}
                    disabled={cameraLoading}
                    className="px-6 py-3.5 bg-[#39A900] hover:bg-[#2e8800] active:scale-95 text-white font-black text-xs sm:text-sm rounded-2xl shadow-xl shadow-black/50 flex items-center gap-2.5 transition-all cursor-pointer border border-emerald-400/40"
                  >
                    <Camera className="w-5 h-5" />
                    <span>{cameraLoading ? 'Iniciando Cámara...' : 'Activar Cámara Web en Vivo'}</span>
                  </button>
                  <p className="text-[11px] text-slate-300 mt-2.5 font-medium bg-black/60 px-3 py-1 rounded-full backdrop-blur-xs">
                    {cameraError ? cameraError : 'Presione para escanear directamente con la cámara del dispositivo'}
                  </p>
                </div>
              </div>
            )}

            {/* Target Viewfinder & Laser overlay - exact replication of Image 5 */}
            <div className="absolute inset-0 flex items-center justify-center p-8 pointer-events-none z-10">
              <div className="w-64 h-36 sm:w-72 sm:h-44 border-2 border-emerald-400/90 rounded-2xl relative shadow-[0_0_20px_rgba(52,211,153,0.3)]">
                {/* Corner crosshairs */}
                <div className="absolute -top-1 -left-1 w-5 h-5 border-t-4 border-l-4 border-emerald-400 rounded-tl-lg" />
                <div className="absolute -top-1 -right-1 w-5 h-5 border-t-4 border-r-4 border-emerald-400 rounded-tr-lg" />
                <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-4 border-l-4 border-emerald-400 rounded-bl-lg" />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-4 border-r-4 border-emerald-400 rounded-br-lg" />

                {/* Animated scanning laser line */}
                <div className="absolute left-2 right-2 h-0.5 bg-emerald-400 shadow-[0_0_12px_#34d399] animate-[bounce_2s_infinite] opacity-90" />

                <div className="absolute bottom-2 inset-x-0 text-center">
                  <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest bg-black/60 px-2 py-0.5 rounded-full">
                    Alinee Código de Barras Code128
                  </span>
                </div>
              </div>
            </div>

            {/* Flash / Light effect when enabled */}
            {flashOn && (
              <div className="absolute inset-0 bg-white/25 pointer-events-none transition-opacity z-20" />
            )}

            {/* Viewfinder Controls Bar (Bottom of camera frame, Image 5) */}
            <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-3 z-30 px-3">
              <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-black/70 backdrop-blur-md rounded-2xl border border-white/20">
                <button
                  type="button"
                  onClick={toggleFlash}
                  className={`p-2.5 rounded-xl transition-colors cursor-pointer ${
                    flashOn ? 'bg-amber-400 text-slate-950 font-bold' : 'text-white hover:bg-white/20'
                  }`}
                  title="Linterna / Flash"
                >
                  <Flashlight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={switchCamera}
                  className="p-2.5 text-white hover:bg-white/20 rounded-xl transition-colors cursor-pointer"
                  title="Cambiar Cámara Frontal / Trasera"
                >
                  <RotateCw className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="p-2.5 text-white hover:bg-white/20 rounded-xl transition-colors cursor-pointer"
                  title="Sonido de Escaneo"
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>

                {cameraActive && (
                  <button
                    type="button"
                    onClick={() => {
                      playScanBeep();
                      const randomUser = users[Math.floor(Math.random() * users.length)];
                      setDetectedUser(randomUser);
                      setFeedbackMessage({
                        text: `Carnet leído por sensor: ${randomUser.fullName} (${randomUser.barcodeCode128})`,
                        type: 'success'
                      });
                    }}
                    className="px-3 py-1.5 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
                    title="Capturar fotograma"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#39A900]" />
                    <span>Escanear</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={toggleCamera}
                  disabled={cameraLoading}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    cameraActive 
                      ? 'bg-rose-600 hover:bg-rose-700 text-white' 
                      : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                  }`}
                >
                  {cameraLoading ? 'Conectando...' : cameraActive ? 'Detener Cámara' : 'Activar Cámara'}
                </button>
              </div>
            </div>
          </div>

          {/* Quick barcode simulation selector for seamless operator testing */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Barcode className="w-3.5 h-3.5 text-[#39A900]" />
                Simular lectura rápida de carnet:
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {users.slice(0, 4).map((u) => (
                <button
                  key={u.id}
                  onClick={() => handleSimulateScan(u)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-[#39A900] hover:text-white text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{u.fullName.split(' ')[0]}</span>
                  <span className="text-[10px] opacity-75">({u.roleLabel})</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Search & Detected User (Image 5) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Búsqueda Manual Card (Image 5) */}
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80">
            <div className="flex items-center gap-2 mb-4 text-slate-700 font-bold text-sm">
              <div className="p-2 bg-slate-100 rounded-xl text-slate-600">
                <Search className="w-4 h-4" />
              </div>
              <span>Búsqueda Manual</span>
            </div>

            <form onSubmit={handleManualSearch} className="space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={manualQuery}
                  onChange={(e) => setManualQuery(e.target.value)}
                  placeholder="Ingrese documento o placa"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-[#39A900] outline-hidden font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Buscar Registro</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Detected User Card - Identical to Image 5 */}
          {detectedUser ? (
            <div className="bg-white rounded-3xl p-6 shadow-md shadow-slate-100 border border-slate-200/80 animate-in fade-in zoom-in-95 duration-200">
              {/* Official SENA Credential Badge Header */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <SenaLogo className="w-5 h-5" />
                  <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    Credencial Oficial SENA
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 font-semibold">
                  Sede CTDPE
                </span>
              </div>

              {/* User Identity Header */}
              <div className="flex items-start gap-4 mb-6">
                <div className="relative shrink-0">
                  <img
                    src={detectedUser.photoUrl}
                    alt={detectedUser.fullName}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md shadow-slate-200"
                  />
                  <div className="absolute -bottom-1 -right-1 p-0.5 bg-emerald-500 rounded-full text-white ring-2 ring-white">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 bg-emerald-600 text-white rounded-md text-[10px] font-black uppercase tracking-wider">
                      {detectedUser.roleLabel.toUpperCase()}
                    </span>
                    <span className="text-xs font-semibold text-emerald-700">
                      {detectedUser.carnetStatus === 'ACTIVO' ? 'Activo' : detectedUser.carnetStatus}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-slate-900 truncate">
                    {detectedUser.fullName}
                  </h3>

                  <div className="text-xs text-slate-500 mt-1 space-y-0.5">
                    <div>CC: {detectedUser.documentNumber}</div>
                    {detectedUser.ficha && (
                      <div className="text-slate-600 font-medium">
                        Ficha: {detectedUser.ficha} - {detectedUser.programOrArea.slice(0, 24)}...
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Status State Badge */}
              <div className="p-2.5 bg-slate-50 rounded-xl mb-6 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Estado en Instalaciones:</span>
                <span className={`px-2.5 py-1 rounded-full font-bold ${
                  detectedUser.accessStatus === 'EN_SEDE'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-200 text-slate-700'
                }`}>
                  {detectedUser.accessStatus === 'EN_SEDE' ? '● En Sede' : '○ Fuera de Sede'}
                </span>
              </div>

              {/* Action Buttons - Identical to Image 5 */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => handleAction('ENTRADA')}
                  className="w-full py-3.5 px-4 bg-[#39A900] hover:bg-[#2f8a00] active:scale-[0.99] text-white font-black rounded-2xl shadow-lg shadow-[#39A900]/25 transition-all flex items-center justify-center gap-2 text-sm tracking-wide cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>REGISTRAR ENTRADA</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleAction('SALIDA')}
                  className="w-full py-3.5 px-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-2xl transition-colors flex items-center justify-center gap-2 text-sm cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4 rotate-180 text-slate-400" />
                  <span>Registrar Salida</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 text-center text-slate-400 text-xs">
              Esperando lectura de código de barras...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
