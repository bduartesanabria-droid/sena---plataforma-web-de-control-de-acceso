export type UserRole = 
  | 'admin' 
  | 'celador' 
  | 'aprendiz' 
  | 'instructor' 
  | 'contratista' 
  | 'funcionario' 
  | 'subdirector';

export type AccessStatus = 'EN_SEDE' | 'FUERA_DE_SEDE';

export type CarnetStatus = 'ACTIVO' | 'PENDIENTE_FOTO' | 'RECHAZADO' | 'INACTIVO';

export type AccessType = 'ENTRADA' | 'SALIDA';

export type EntityType = 'USUARIO' | 'VISITANTE' | 'VEHICULO' | 'OBJETO';

export type TabType = 'dashboard' | 'scanner' | 'visitors' | 'history' | 'carnet' | 'admin';

export interface User {
  id: string;
  documentNumber: string;
  documentType: 'CC' | 'TI' | 'CE' | 'PAS';
  fullName: string;
  email: string;
  role: UserRole;
  roleLabel: string;
  photoUrl: string;
  carnetStatus: CarnetStatus;
  accessStatus: AccessStatus;
  ficha?: string;
  programOrArea: string;
  regional: string;
  centro: string;
  barcodeCode128: string;
  phone?: string;
  lastMovementTime?: string;
  bloodType?: string;
  photoRejectReason?: string;
}

export interface AccessLog {
  id: string;
  timestamp: string;
  relativeTime: string;
  documentNumber: string;
  fullName: string;
  role: string;
  type: AccessType;
  entityType: EntityType;
  vehiclePlate?: string;
  gate: string;
  celadorName: string;
  forced?: boolean;
  forcedReason?: string;
}

export interface Visitor {
  id: string;
  documentNumber: string;
  fullName: string;
  reason: string;
  hostPersonOrArea: string;
  entryDate: string;
  accessStatus: AccessStatus;
  badgeCode: string;
  vehiclePlate?: string;
}

export interface Vehicle {
  id: string;
  plate: string;
  type: 'MOTO' | 'CARRO' | 'BICICLETA';
  ownerDoc: string;
  ownerName: string;
  parkingSlot: string;
  status: AccessStatus;
  registeredAt: string;
}

export interface AuditLogItem {
  id: string;
  title: string;
  description: string;
  time: string;
  status: 'Completado' | 'Bloqueado' | 'Automático';
  type: 'role' | 'security' | 'sync' | 'photo';
}

export interface PendingPhotoItem {
  id: string;
  userId: string;
  fullName: string;
  documentNumber: string;
  roleLabel: string;
  fichaOrInfo: string;
  photoUrl: string;
  requestedAt: string;
  warning?: string;
}
