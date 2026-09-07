import { User, AccessLog, Visitor, Vehicle, AuditLogItem, PendingPhotoItem } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-1',
    documentNumber: '1023456789',
    documentType: 'CC',
    fullName: 'JUAN CARLOS GÓMEZ PÉREZ',
    email: 'jcgomez@sena.edu.co',
    role: 'instructor',
    roleLabel: 'Instructor Técnico',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    carnetStatus: 'ACTIVO',
    accessStatus: 'EN_SEDE',
    programOrArea: 'Centro de Gestión de Mercados',
    regional: 'Regional Distrito Capital',
    centro: 'Centro de Gestión de Mercados',
    barcodeCode128: '1023456789',
    phone: '3104558921',
    lastMovementTime: '08:05 AM',
    bloodType: 'O+'
  },
  {
    id: 'usr-2',
    documentNumber: '1002334556',
    documentType: 'CC',
    fullName: 'Juan Pérez',
    email: 'jperez.aprendiz@misena.edu.co',
    role: 'aprendiz',
    roleLabel: 'Aprendiz SENA',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
    carnetStatus: 'ACTIVO',
    accessStatus: 'FUERA_DE_SEDE',
    ficha: '2543678',
    programOrArea: 'Análisis y Desarrollo de Software (ADSO)',
    regional: 'Regional Distrito Capital',
    centro: 'Centro de Electricidad y Automatización',
    barcodeCode128: '1002334556',
    phone: '3157771234',
    lastMovementTime: 'Ayer 06:10 PM',
    bloodType: 'A+'
  },
  {
    id: 'usr-3',
    documentNumber: '1092334551',
    documentType: 'CC',
    fullName: 'Carlos Ramírez Silva',
    email: 'cramirez@misena.edu.co',
    role: 'aprendiz',
    roleLabel: 'Aprendiz',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    carnetStatus: 'ACTIVO',
    accessStatus: 'EN_SEDE',
    ficha: '2543678',
    programOrArea: 'Tecnología en Gestión Administrativa',
    regional: 'Regional Santander',
    centro: 'Centro Industrial y del Desarrollo Tecnológico',
    barcodeCode128: '1092334551',
    phone: '3208889911',
    lastMovementTime: '08:14 AM',
    bloodType: 'O+'
  },
  {
    id: 'usr-4',
    documentNumber: '42887112',
    documentType: 'CC',
    fullName: 'Ana María Gómez',
    email: 'amgomez@sena.edu.co',
    role: 'instructor',
    roleLabel: 'Instructor',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    carnetStatus: 'ACTIVO',
    accessStatus: 'FUERA_DE_SEDE',
    programOrArea: 'Coordinación de Formación Virtual',
    regional: 'Regional Antioquia',
    centro: 'Centro de Servicios y Gestión Empresarial',
    barcodeCode128: '42887112',
    phone: '3112224455',
    lastMovementTime: '08:05 AM',
    bloodType: 'B+'
  },
  {
    id: 'usr-5',
    documentNumber: '109865432',
    documentType: 'CC',
    fullName: 'Andrés Felipe Gómez',
    email: 'afgomez@misena.edu.co',
    role: 'aprendiz',
    roleLabel: 'Aprendiz',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    carnetStatus: 'PENDIENTE_FOTO',
    accessStatus: 'FUERA_DE_SEDE',
    ficha: '255890',
    programOrArea: 'Mantenimiento Mecatrónico',
    regional: 'Regional Distrito Capital',
    centro: 'Centro Metalmecánico',
    barcodeCode128: '109865432',
    phone: '3009988776',
    bloodType: 'O-'
  },
  {
    id: 'usr-6',
    documentNumber: '1023456789',
    documentType: 'TI',
    fullName: 'Mariana Londoño Pérez',
    email: 'mlondono@misena.edu.co',
    role: 'aprendiz',
    roleLabel: 'Aprendiz',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    carnetStatus: 'ACTIVO',
    accessStatus: 'EN_SEDE',
    ficha: '2671900',
    programOrArea: 'Diseño Gráfico Digital',
    regional: 'Regional Distrito Capital',
    centro: 'Centro para la Industria de la Comunicación Gráfica',
    barcodeCode128: '1023456789',
    phone: '3145558899',
    lastMovementTime: '07:45 AM',
    bloodType: 'A+'
  },
  {
    id: 'usr-7',
    documentNumber: '79888123',
    documentType: 'CC',
    fullName: 'Carlos Ruiz Bermúdez',
    email: 'cruiz@sena.edu.co',
    role: 'instructor',
    roleLabel: 'Instructor',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
    carnetStatus: 'ACTIVO',
    accessStatus: 'FUERA_DE_SEDE',
    programOrArea: 'Área de Telecomunicaciones',
    regional: 'Regional Valle',
    centro: 'Centro de Electricidad y Automatización',
    barcodeCode128: '79888123',
    phone: '3187776655',
    lastMovementTime: '07:42 AM',
    bloodType: 'O+'
  },
  {
    id: 'usr-8',
    documentNumber: '1098333111',
    documentType: 'CC',
    fullName: 'David Osorio',
    email: 'dosorio@misena.edu.co',
    role: 'aprendiz',
    roleLabel: 'Aprendiz',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
    carnetStatus: 'ACTIVO',
    accessStatus: 'EN_SEDE',
    ficha: '2718899',
    programOrArea: 'Contabilidad y Finanzas',
    regional: 'Regional Distrito Capital',
    centro: 'Centro de Servicios Financieros',
    barcodeCode128: '1098333111',
    phone: '3161112233',
    lastMovementTime: '07:25 AM',
    bloodType: 'B+'
  },
  {
    id: 'usr-9',
    documentNumber: '15344900',
    documentType: 'CC',
    fullName: 'Luis Fernando Torres',
    email: 'luistorres@proveedor.com',
    role: 'contratista',
    roleLabel: 'Visitante',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
    carnetStatus: 'ACTIVO',
    accessStatus: 'EN_SEDE',
    programOrArea: 'Mantenimiento Redes Eléctricas',
    regional: 'Regional Distrito Capital',
    centro: 'Sede Principal',
    barcodeCode128: '15344900',
    phone: '3129990011',
    lastMovementTime: '07:50 AM',
    bloodType: 'O+'
  },
  {
    id: 'usr-celador',
    documentNumber: '80123999',
    documentType: 'CC',
    fullName: 'John D.',
    email: 'seguridad.porteria1@sena.edu.co',
    role: 'celador',
    roleLabel: 'Celador de Turno',
    photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
    carnetStatus: 'ACTIVO',
    accessStatus: 'EN_SEDE',
    programOrArea: 'Portería Principal - Control de Acceso',
    regional: 'Regional Distrito Capital',
    centro: 'Complejo Central SENA',
    barcodeCode128: '80123999',
    phone: '3101234567'
  },
  {
    id: 'usr-admin',
    documentNumber: '52441980',
    documentType: 'CC',
    fullName: 'Laura Roa',
    email: 'lroa@sena.edu.co',
    role: 'admin',
    roleLabel: 'Administradora de Sede',
    photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
    carnetStatus: 'ACTIVO',
    accessStatus: 'EN_SEDE',
    programOrArea: 'Subdirección de Centro y Administración',
    regional: 'Regional Distrito Capital',
    centro: 'Complejo Central SENA',
    barcodeCode128: '52441980',
    phone: '3158883344'
  }
];

export const INITIAL_ACCESS_LOGS: AccessLog[] = [
  {
    id: 'log-1',
    timestamp: 'Hoy, 08:14 AM',
    relativeTime: 'Hace 1 min',
    documentNumber: '1.092.334.551',
    fullName: 'Carlos Ramírez Silva',
    role: 'Aprendiz',
    type: 'ENTRADA',
    entityType: 'USUARIO',
    gate: 'Portería Principal (Torniquete 1)',
    celadorName: 'John D.'
  },
  {
    id: 'log-2',
    timestamp: 'Hoy, 08:05 AM',
    relativeTime: 'Hace 10 min',
    documentNumber: '42.887.112',
    fullName: 'Ana María Gómez',
    role: 'Instructor',
    type: 'SALIDA',
    entityType: 'USUARIO',
    gate: 'Portería Principal (Torniquete 2)',
    celadorName: 'John D.'
  },
  {
    id: 'log-3',
    timestamp: 'Hoy, 07:50 AM',
    relativeTime: 'Hace 25 min',
    documentNumber: '15.344.900',
    fullName: 'Luis Fernando Torres',
    role: 'Visitante',
    type: 'ENTRADA',
    entityType: 'VISITANTE',
    gate: 'Portería Vehicular / Peatonal',
    celadorName: 'John D.'
  },
  {
    id: 'log-4',
    timestamp: 'Hoy, 07:45 AM',
    relativeTime: 'Hace 30 min',
    documentNumber: '1.023.456.789',
    fullName: 'Mariana Londoño Pérez',
    role: 'Aprendiz',
    type: 'ENTRADA',
    entityType: 'USUARIO',
    gate: 'Portería Principal (Torniquete 1)',
    celadorName: 'John D.'
  },
  {
    id: 'log-5',
    timestamp: 'Hoy, 07:42 AM',
    relativeTime: 'Hace 33 min',
    documentNumber: '79.888.123',
    fullName: 'Carlos Ruiz Bermúdez',
    role: 'Instructor',
    type: 'SALIDA',
    entityType: 'USUARIO',
    gate: 'Portería Principal (Torniquete 2)',
    celadorName: 'John D.'
  },
  {
    id: 'log-6',
    timestamp: 'Hoy, 07:30 AM',
    relativeTime: 'Hace 45 min',
    documentNumber: '1.144.555.222',
    fullName: 'Ana Sofía Henao',
    role: 'Visitante',
    type: 'ENTRADA',
    entityType: 'VISITANTE',
    gate: 'Portería Principal (Ventanilla)',
    celadorName: 'John D.'
  },
  {
    id: 'log-7',
    timestamp: 'Hoy, 07:25 AM',
    relativeTime: 'Hace 50 min',
    documentNumber: '1.098.333.111',
    fullName: 'David Osorio',
    role: 'Aprendiz',
    type: 'ENTRADA',
    entityType: 'USUARIO',
    gate: 'Portería Principal (Torniquete 3)',
    celadorName: 'John D.'
  }
];

export const INITIAL_VISITORS: Visitor[] = [
  {
    id: 'vis-1',
    documentNumber: '15344900',
    fullName: 'Luis Fernando Torres',
    reason: 'Mantenimiento de transformadores eléctricos',
    hostPersonOrArea: 'Ingeniería y Mantenimiento',
    entryDate: 'Hoy, 07:50 AM',
    accessStatus: 'EN_SEDE',
    badgeCode: 'VIS-2023-089',
    vehiclePlate: 'BTL-456'
  },
  {
    id: 'vis-2',
    documentNumber: '1144555222',
    fullName: 'Ana Sofía Henao',
    reason: 'Reunión convenio empresarial etapa práctica',
    hostPersonOrArea: 'Coordinación Académica - Dr. Gómez',
    entryDate: 'Hoy, 07:30 AM',
    accessStatus: 'EN_SEDE',
    badgeCode: 'VIS-2023-090'
  }
];

export const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'veh-1',
    plate: 'KLU-892',
    type: 'MOTO',
    ownerDoc: '1092334551',
    ownerName: 'Carlos Ramírez Silva',
    parkingSlot: 'Bahía Motos B-14',
    status: 'EN_SEDE',
    registeredAt: 'Hoy, 08:12 AM'
  },
  {
    id: 'veh-2',
    plate: 'BTL-456',
    type: 'CARRO',
    ownerDoc: '15344900',
    ownerName: 'Luis Fernando Torres',
    parkingSlot: 'Visitantes V-03',
    status: 'EN_SEDE',
    registeredAt: 'Hoy, 07:48 AM'
  },
  {
    id: 'veh-3',
    plate: 'QWE-102',
    type: 'BICICLETA',
    ownerDoc: '1098333111',
    ownerName: 'David Osorio',
    parkingSlot: 'Bicicletero A-08',
    status: 'EN_SEDE',
    registeredAt: 'Hoy, 07:22 AM'
  }
];

export const INITIAL_PENDING_PHOTOS: PendingPhotoItem[] = [
  {
    id: 'pend-1',
    userId: 'usr-5',
    fullName: 'Andrés Felipe Gómez',
    documentNumber: 'CC 1098765432',
    roleLabel: 'Aprendiz',
    fichaOrInfo: 'FICHA 255890',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    requestedAt: 'Hoy 09:30 AM'
  },
  {
    id: 'pend-2',
    userId: 'usr-pend-2',
    fullName: 'Maria Camila Tobar',
    documentNumber: 'TI 1023456789',
    roleLabel: 'Visitante',
    fichaOrInfo: 'VISITANTE FRECUENTE',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    requestedAt: 'Hoy 10:15 AM'
  },
  {
    id: 'pend-3',
    userId: 'usr-pend-3',
    fullName: 'Luis Fernando Rodríguez',
    documentNumber: 'CC 1014298841',
    roleLabel: 'Aprendiz',
    fichaOrInfo: 'FICHA 289102',
    photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
    requestedAt: 'Ayer 04:50 PM',
    warning: 'Foto Dañada/Cortada'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'aud-1',
    title: 'Cambio de rol: Portería Sur',
    description: "Admin 'JPerez' actualizó permisos de escaneo para operador 'CMartinez'.",
    time: '10:42 AM',
    status: 'Completado',
    type: 'role'
  },
  {
    id: 'aud-2',
    title: 'Intento fallido de acceso (Admin)',
    description: 'IP no autorizada 192.168.1.44 intentó acceder al panel de administración.',
    time: '09:15 AM',
    status: 'Bloqueado',
    type: 'security'
  },
  {
    id: 'aud-3',
    title: 'Sincronización de BD Fichas',
    description: 'Sistema automatizado importó 45 nuevos aprendices desde Sofía Plus.',
    time: '02:00 AM',
    status: 'Automático',
    type: 'sync'
  },
  {
    id: 'aud-4',
    title: 'Aprobación masiva de fotos',
    description: "Admin 'LRoa' aprobó 12 fotografías de la Ficha 255890.",
    time: 'Ayer',
    status: 'Completado',
    type: 'photo'
  }
];
