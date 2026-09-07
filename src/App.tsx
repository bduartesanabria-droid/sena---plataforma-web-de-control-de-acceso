import React, { useState, useEffect } from 'react';
import { Sidebar, TabType } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { LoginScreen } from './components/LoginScreen';
import { DashboardView } from './components/screens/DashboardView';
import { ScannerView } from './components/screens/ScannerView';
import { VisitorsView } from './components/screens/VisitorsView';
import { HistoryView } from './components/screens/HistoryView';
import { CarnetView } from './components/screens/CarnetView';
import { AdminView } from './components/screens/AdminView';
import { DuplicateEntryModal } from './components/DuplicateEntryModal';
import { SupabaseModal } from './components/SupabaseModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { 
  supabase,
  syncAccessLogToSupabase,
  syncUserStatusToSupabase,
  syncVisitorToSupabase,
  syncVehicleToSupabase,
  syncAuditLogToSupabase,
  syncPendingPhotoToSupabase,
  deletePendingPhotoFromSupabase,
  updateCarnetApprovalInSupabase,
  fetchAllFromSupabase
} from './lib/supabase';
import { 
  INITIAL_USERS, 
  INITIAL_ACCESS_LOGS, 
  INITIAL_VISITORS, 
  INITIAL_VEHICLES, 
  INITIAL_PENDING_PHOTOS, 
  INITIAL_AUDIT_LOGS 
} from './data/mockData';
import { User, AccessLog, Visitor, Vehicle, PendingPhotoItem, AuditLogItem, AccessType, UserRole } from './types';

export default function App() {
  // Session State - starts logged in as Celador John D. for instant preview, with login screen switchable
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('sena_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    return users.find(u => u.role === 'celador') || users[0];
  });

  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  const [accessLogs, setAccessLogs] = useState<AccessLog[]>(() => {
    const saved = localStorage.getItem('sena_logs');
    return saved ? JSON.parse(saved) : INITIAL_ACCESS_LOGS;
  });

  const [visitors, setVisitors] = useState<Visitor[]>(() => {
    const saved = localStorage.getItem('sena_visitors');
    return saved ? JSON.parse(saved) : INITIAL_VISITORS;
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const saved = localStorage.getItem('sena_vehicles');
    return saved ? JSON.parse(saved) : INITIAL_VEHICLES;
  });

  const [pendingPhotos, setPendingPhotos] = useState<PendingPhotoItem[]>(() => {
    const saved = localStorage.getItem('sena_pending_photos');
    return saved ? JSON.parse(saved) : INITIAL_PENDING_PHOTOS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(() => {
    const saved = localStorage.getItem('sena_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  // Strict access validation modal state
  const [duplicateModal, setDuplicateModal] = useState<{
    isOpen: boolean;
    user: User | null;
    attemptedType: AccessType;
  }>({
    isOpen: false,
    user: null,
    attemptedType: 'ENTRADA'
  });

  // Mobile drawer state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Synchronize state changes to localStorage
  useEffect(() => {
    localStorage.setItem('sena_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('sena_logs', JSON.stringify(accessLogs));
  }, [accessLogs]);

  useEffect(() => {
    localStorage.setItem('sena_pending_photos', JSON.stringify(pendingPhotos));
  }, [pendingPhotos]);

  useEffect(() => {
    localStorage.setItem('sena_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Initial fetch from Supabase PostgreSQL (if tables have been created)
  useEffect(() => {
    async function loadRemoteData() {
      try {
        const remote = await fetchAllFromSupabase();
        if (remote.users && remote.users.length > 0) {
          setUsers(remote.users);
        }
        if (remote.accessLogs && remote.accessLogs.length > 0) {
          setAccessLogs(remote.accessLogs);
        }
        if (remote.visitors && remote.visitors.length > 0) {
          setVisitors(remote.visitors);
        }
        if (remote.vehicles && remote.vehicles.length > 0) {
          setVehicles(remote.vehicles);
        }
        if (remote.pendingPhotos && remote.pendingPhotos.length > 0) {
          setPendingPhotos(remote.pendingPhotos);
        }
        if (remote.auditLogs && remote.auditLogs.length > 0) {
          setAuditLogs(remote.auditLogs);
        }
      } catch (e) {
        console.warn('Could not hydrate from Supabase, using local state:', e);
      }
    }

    loadRemoteData();

    // Supabase Real-time Channel for instant synchronization across tabs & devices
    const channel = supabase
      .channel('sena-realtime-access')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'access_logs' },
        (payload) => {
          const row = payload.new as any;
          if (row && row.id) {
            setAccessLogs((prev) => {
              if (prev.some((l) => l.id === row.id)) return prev;
              const incoming: AccessLog = {
                id: row.id,
                timestamp: row.timestamp,
                relativeTime: row.relative_time || 'Ahora mismo',
                documentNumber: row.document_number,
                fullName: row.full_name,
                role: row.role,
                type: row.type,
                entityType: row.entity_type || 'USUARIO',
                vehiclePlate: row.vehicle_plate,
                gate: row.gate || 'Portería Principal',
                celadorName: row.celador_name,
                forced: row.forced,
                forcedReason: row.forced_reason,
              };
              return [incoming, ...prev];
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Handle access registration with strict status checking
  const handleRegisterAccess = (user: User, type: AccessType, forcedReason?: string) => {
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });

    const newLog: AccessLog = {
      id: `log-${Date.now()}`,
      timestamp: `Hoy, ${timeFormatted}`,
      relativeTime: 'Ahora mismo',
      documentNumber: user.documentNumber.replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
      fullName: user.fullName,
      role: user.roleLabel,
      type,
      entityType: 'USUARIO',
      gate: 'Portería Principal',
      celadorName: currentUser.role === 'celador' ? currentUser.fullName : 'John D.',
      forced: !!forcedReason,
      forcedReason
    };

    // Update user access status
    const newStatus = type === 'ENTRADA' ? 'EN_SEDE' : 'FUERA_DE_SEDE';
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, accessStatus: newStatus, lastMovementTime: timeFormatted } : u));
    
    // Add log
    setAccessLogs(prev => [newLog, ...prev]);

    // Push to Supabase
    syncAccessLogToSupabase(newLog);
    syncUserStatusToSupabase(user.id, newStatus, timeFormatted);

    // If this was an override, log to audit trail
    if (forcedReason) {
      const auditItem: AuditLogItem = {
        id: `aud-${Date.now()}`,
        title: `Excepción de Acceso: ${type}`,
        description: `Celador '${currentUser.fullName}' forzó ${type} para '${user.fullName}'. Motivo: ${forcedReason}`,
        time: timeFormatted,
        status: 'Completado',
        type: 'security'
      };
      setAuditLogs(prev => [auditItem, ...prev]);
      syncAuditLogToSupabase(auditItem);
    }
  };

  const handleRequestDuplicateCheck = (user: User, type: AccessType) => {
    setDuplicateModal({
      isOpen: true,
      user,
      attemptedType: type
    });
  };

  const handleConfirmForcedAccess = (reason: string) => {
    if (duplicateModal.user) {
      handleRegisterAccess(duplicateModal.user, duplicateModal.attemptedType, reason);
    }
    setDuplicateModal({ isOpen: false, user: null, attemptedType: 'ENTRADA' });
  };

  // Add visitor
  const handleAddVisitor = (newVisitor: Visitor) => {
    setVisitors(prev => [newVisitor, ...prev]);
    syncVisitorToSupabase(newVisitor);

    // Also register an access entry
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
    const logItem: AccessLog = {
      id: `log-vis-${Date.now()}`,
      timestamp: `Hoy, ${timeFormatted}`,
      relativeTime: 'Ahora mismo',
      documentNumber: newVisitor.documentNumber,
      fullName: newVisitor.fullName,
      role: 'Visitante',
      type: 'ENTRADA',
      entityType: 'VISITANTE',
      gate: 'Portería Principal (Ventanilla)',
      celadorName: currentUser.fullName
    };
    setAccessLogs(prev => [logItem, ...prev]);
    syncAccessLogToSupabase(logItem);
  };

  // Add vehicle
  const handleAddVehicle = (newVeh: Vehicle) => {
    setVehicles(prev => [newVeh, ...prev]);
    syncVehicleToSupabase(newVeh);
  };

  // Admin Photo Approval
  const handleApprovePhoto = (item: PendingPhotoItem) => {
    // 1. Activate carnet for user
    setUsers(prev => prev.map(u => {
      if (u.id === item.userId || u.documentNumber === item.documentNumber.replace(/\D/g, '')) {
        return {
          ...u,
          photoUrl: item.photoUrl,
          carnetStatus: 'ACTIVO'
        };
      }
      return u;
    }));

    // 2. Remove from pending queue
    setPendingPhotos(prev => prev.filter(p => p.id !== item.id));

    // 3. Add to Audit log
    const now = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
    const auditItem: AuditLogItem = {
      id: `aud-${Date.now()}`,
      title: 'Aprobación de Credencial',
      description: `Admin '${currentUser.fullName}' aprobó fotografía de carnet para '${item.fullName}' (${item.fichaOrInfo}). Carnet activado.`,
      time: now,
      status: 'Completado',
      type: 'photo'
    };
    setAuditLogs(prev => [auditItem, ...prev]);

    // Push to Supabase
    updateCarnetApprovalInSupabase(item.userId, item.photoUrl, 'ACTIVO');
    deletePendingPhotoFromSupabase(item.id);
    syncAuditLogToSupabase(auditItem);
  };

  // Admin Photo Reject
  const handleRejectPhoto = (item: PendingPhotoItem, reason: string) => {
    // 1. Set carnet as RECHAZADO
    setUsers(prev => prev.map(u => {
      if (u.id === item.userId || u.documentNumber === item.documentNumber.replace(/\D/g, '')) {
        return {
          ...u,
          carnetStatus: 'RECHAZADO',
          photoRejectReason: reason
        };
      }
      return u;
    }));

    // 2. Remove from pending queue
    setPendingPhotos(prev => prev.filter(p => p.id !== item.id));

    // 3. Add to Audit log
    const now = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
    const auditItem: AuditLogItem = {
      id: `aud-${Date.now()}`,
      title: 'Rechazo de Fotografía',
      description: `Admin '${currentUser.fullName}' rechazó foto para '${item.fullName}'. Motivo: ${reason}`,
      time: now,
      status: 'Bloqueado',
      type: 'photo'
    };
    setAuditLogs(prev => [auditItem, ...prev]);

    // Push to Supabase
    deletePendingPhotoFromSupabase(item.id);
    syncAuditLogToSupabase(auditItem);
  };

  // User upload photo from carnet screen
  const handleUserUploadPhoto = (userId: string, photoUrl: string) => {
    const targetUser = users.find(u => u.id === userId) || currentUser;
    
    // Add to pending photos queue
    const newPending: PendingPhotoItem = {
      id: `pend-${Date.now()}`,
      userId: targetUser.id,
      fullName: targetUser.fullName,
      documentNumber: `${targetUser.documentType} ${targetUser.documentNumber}`,
      roleLabel: targetUser.roleLabel,
      fichaOrInfo: targetUser.ficha ? `FICHA ${targetUser.ficha}` : targetUser.programOrArea,
      photoUrl,
      requestedAt: 'Hoy ' + new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
    };

    setPendingPhotos(prev => [newPending, ...prev]);
    syncPendingPhotoToSupabase(newPending);

    // Update user carnetStatus to PENDIENTE_FOTO
    setUsers(prev => prev.map(u => u.id === targetUser.id ? { ...u, carnetStatus: 'PENDIENTE_FOTO' } : u));
    if (currentUser.id === targetUser.id) {
      setCurrentUser(prev => ({ ...prev, carnetStatus: 'PENDIENTE_FOTO' }));
    }
  };

  // Switch Role
  const handleSwitchRole = (role: UserRole) => {
    const matched = users.find(u => u.role === role);
    if (matched) {
      setCurrentUser(matched);
      if (['aprendiz', 'instructor', 'contratista', 'funcionario', 'subdirector'].includes(role)) {
        setActiveTab('carnet');
      } else if (role === 'admin') {
        setActiveTab('admin');
      } else {
        setActiveTab('dashboard');
      }
    }
  };

  // Dynamic titles
  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Panel de Control';
      case 'scanner':
        return 'Control de Acceso';
      case 'visitors':
        return 'Registro de Visitantes y Vehículos';
      case 'history':
        return 'Historial de Portería';
      case 'carnet':
        return 'Carnet Institucional Digital';
      case 'admin':
        return 'Administración y Seguridad';
      default:
        return 'Panel de Control';
    }
  };

  // If not logged in, render Login Screen (Image 3)
  if (!isLoggedIn) {
    return (
      <LoginScreen
        users={users}
        onLogin={(user) => {
          setCurrentUser(user);
          setIsLoggedIn(true);
          if (['aprendiz', 'instructor'].includes(user.role)) {
            setActiveTab('carnet');
          } else if (user.role === 'admin') {
            setActiveTab('admin');
          } else {
            setActiveTab('dashboard');
          }
        }}
      />
    );
  }

  // Calculate live statistics
  const peopleInCampusCount = users.filter(u => u.accessStatus === 'EN_SEDE').length + visitors.filter(v => v.accessStatus === 'EN_SEDE').length + 140;
  const visitorsTodayCount = visitors.length + 10;
  const vehiclesCount = vehicles.length + 125;

  return (
    <div className="flex h-screen bg-[#F8F9FA] overflow-hidden text-slate-800">
      {/* Sidebar - Matching Image 5, 7, 9, 11, 13, 15 */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        currentUser={currentUser}
        pendingPhotosCount={pendingPhotos.length}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <TopHeader
          title={getTabTitle()}
          currentUser={currentUser}
          onLogout={() => setIsLoggedIn(false)}
          onSwitchRole={handleSwitchRole}
          pendingPhotosCount={pendingPhotos.length}
          onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
          onToggleMobileMenu={() => setIsMobileMenuOpen(prev => !prev)}
        />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#FAFAFA] pb-24 lg:pb-8">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && (
              <DashboardView
                onNavigate={setActiveTab}
                recentLogs={accessLogs}
                peopleInCampus={peopleInCampusCount}
                visitorsTodayCount={visitorsTodayCount}
              />
            )}

            {activeTab === 'scanner' && (
              <ScannerView
                users={users}
                onRegisterAccess={handleRegisterAccess}
                onRequestDuplicateCheck={handleRequestDuplicateCheck}
              />
            )}

            {activeTab === 'visitors' && (
              <VisitorsView
                onAddVisitor={handleAddVisitor}
                onAddVehicle={handleAddVehicle}
              />
            )}

            {activeTab === 'history' && (
              <HistoryView logs={accessLogs} />
            )}

            {activeTab === 'carnet' && (
              <CarnetView
                currentUser={currentUser}
                onPhotoUploaded={handleUserUploadPhoto}
              />
            )}

            {activeTab === 'admin' && (
              <AdminView
                auditLogs={auditLogs}
                pendingPhotos={pendingPhotos}
                onApprovePhoto={handleApprovePhoto}
                onRejectPhoto={handleRejectPhoto}
                totalEntriesToday={1245}
                vehiclesCount={vehiclesCount}
                onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
              />
            )}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (for Phones & Tablets) */}
      <MobileBottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        currentUser={currentUser}
        pendingPhotosCount={pendingPhotos.length}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
      />

      {/* Strict Access Validation Modal (Duplicate Entry Prevention) */}
      {duplicateModal.isOpen && duplicateModal.user && (
        <DuplicateEntryModal
          isOpen={duplicateModal.isOpen}
          onClose={() => setDuplicateModal({ isOpen: false, user: null, attemptedType: 'ENTRADA' })}
          onForceConfirm={handleConfirmForcedAccess}
          user={duplicateModal.user}
          attemptedType={duplicateModal.attemptedType}
        />
      )}

      {/* Supabase PostgreSQL Integration & Migration Modal */}
      <SupabaseModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        users={users}
        accessLogs={accessLogs}
        visitors={visitors}
        vehicles={vehicles}
        pendingPhotos={pendingPhotos}
        auditLogs={auditLogs}
        onRefreshData={async () => {
          const fresh = await fetchAllFromSupabase();
          if (fresh.users && fresh.users.length > 0) setUsers(fresh.users);
          if (fresh.accessLogs && fresh.accessLogs.length > 0) setAccessLogs(fresh.accessLogs);
          if (fresh.visitors && fresh.visitors.length > 0) setVisitors(fresh.visitors);
          if (fresh.vehicles && fresh.vehicles.length > 0) setVehicles(fresh.vehicles);
          if (fresh.pendingPhotos && fresh.pendingPhotos.length > 0) setPendingPhotos(fresh.pendingPhotos);
          if (fresh.auditLogs && fresh.auditLogs.length > 0) setAuditLogs(fresh.auditLogs);
        }}
      />
    </div>
  );
}
