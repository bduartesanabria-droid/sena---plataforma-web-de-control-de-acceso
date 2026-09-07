import { createClient } from '@supabase/supabase-js';
import { User, AccessLog, Visitor, Vehicle, PendingPhotoItem, AuditLogItem } from '../types';

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://didrauoufisvyyyirzzq.supabase.co';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_QatlcXY8n473m7SUGzGrVQ_uvD46P49';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

// Create Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export interface SupabaseHealth {
  connected: boolean;
  message: string;
  url: string;
  hasTables: boolean;
}

/**
 * Checks connection to the Supabase instance
 */
export async function checkSupabaseConnection(): Promise<SupabaseHealth> {
  try {
    if (!isSupabaseConfigured) {
      return {
        connected: false,
        message: 'Credenciales de Supabase no configuradas',
        url: SUPABASE_URL,
        hasTables: false,
      };
    }

    // Try a simple query to see if connection succeeds and tables exist
    const { data, error } = await supabase.from('users').select('id').limit(1);

    if (error) {
      // If error is 404 or relation does not exist, connection works but tables need migration
      if (error.code === '42P01' || error.message.includes('relation "public.users" does not exist') || error.message.includes('not found')) {
        return {
          connected: true,
          message: 'Conectado a Supabase. Las tablas aún no han sido migradas en el proyecto.',
          url: SUPABASE_URL,
          hasTables: false,
        };
      }
      return {
        connected: true,
        message: `Conectado a Supabase (${error.message})`,
        url: SUPABASE_URL,
        hasTables: false,
      };
    }

    return {
      connected: true,
      message: 'Conexión activa y tablas verificadas con éxito',
      url: SUPABASE_URL,
      hasTables: true,
    };
  } catch (err: any) {
    return {
      connected: false,
      message: err?.message || 'Error al conectar con Supabase',
      url: SUPABASE_URL,
      hasTables: false,
    };
  }
}

/**
 * SQL Schema migration string to run in Supabase SQL editor
 */
export const SUPABASE_SCHEMA_SQL = `-- =========================================================================
-- ESQUEMA COMPLETO: SENA PLATAFORMA WEB DE CONTROL DE ACCESO
-- Proyecto: didrauoufisvyyyirzzq.supabase.co
-- =========================================================================

-- 1. Tabla de Usuarios Institucionales (Aprendices, Instructores, Celadores, Admins)
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  document_number TEXT UNIQUE NOT NULL,
  document_type TEXT NOT NULL DEFAULT 'CC',
  full_name TEXT NOT NULL,
  email TEXT,
  role TEXT NOT NULL DEFAULT 'aprendiz',
  role_label TEXT NOT NULL,
  photo_url TEXT,
  carnet_status TEXT NOT NULL DEFAULT 'PENDIENTE_FOTO',
  access_status TEXT NOT NULL DEFAULT 'FUERA_DE_SEDE',
  ficha TEXT,
  program_or_area TEXT NOT NULL,
  regional TEXT DEFAULT 'Regional Distrito Capital',
  centro TEXT DEFAULT 'Centro de Gestión de Mercados, Logística y TIC',
  barcode_code128 TEXT UNIQUE NOT NULL,
  phone TEXT,
  blood_type TEXT DEFAULT 'O+',
  last_movement_time TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Registro de Accesos (Torniquetes y Portería)
CREATE TABLE IF NOT EXISTS public.access_logs (
  id TEXT PRIMARY KEY,
  timestamp TEXT NOT NULL,
  relative_time TEXT,
  document_number TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL,
  type TEXT NOT NULL, -- 'ENTRADA' | 'SALIDA'
  entity_type TEXT NOT NULL DEFAULT 'USUARIO',
  vehicle_plate TEXT,
  gate TEXT DEFAULT 'Portería Principal',
  celador_name TEXT NOT NULL,
  forced BOOLEAN DEFAULT FALSE,
  forced_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Registro de Visitantes
CREATE TABLE IF NOT EXISTS public.visitors (
  id TEXT PRIMARY KEY,
  document_number TEXT NOT NULL,
  full_name TEXT NOT NULL,
  reason TEXT NOT NULL,
  host_person_or_area TEXT NOT NULL,
  entry_date TEXT NOT NULL,
  access_status TEXT NOT NULL DEFAULT 'EN_SEDE',
  badge_code TEXT NOT NULL,
  vehicle_plate TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Registro de Vehículos en Parqueadero
CREATE TABLE IF NOT EXISTS public.vehicles (
  id TEXT PRIMARY KEY,
  plate TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL, -- 'MOTO' | 'CARRO' | 'BICICLETA'
  owner_doc TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  parking_slot TEXT,
  status TEXT NOT NULL DEFAULT 'EN_SEDE',
  registered_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Solicitudes de Fotografías de Carnet Pendientes
CREATE TABLE IF NOT EXISTS public.pending_photos (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  full_name TEXT NOT NULL,
  document_number TEXT NOT NULL,
  role_label TEXT NOT NULL,
  ficha_or_info TEXT NOT NULL,
  photo_url TEXT NOT NULL,
  requested_at TEXT NOT NULL,
  warning TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Auditoría y Novedades de Seguridad
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  time TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Completado',
  type TEXT NOT NULL DEFAULT 'security',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar Políticas RLS con Acceso Público de Lectura/Escritura para el Prototipo SENA
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.access_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pending_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read-write users" ON public.users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write access_logs" ON public.access_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write visitors" ON public.visitors FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write vehicles" ON public.vehicles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write pending_photos" ON public.pending_photos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write audit_logs" ON public.audit_logs FOR ALL USING (true) WITH CHECK (true);
`;

/**
 * Service to sync access logs to Supabase
 */
export async function syncAccessLogToSupabase(log: AccessLog): Promise<boolean> {
  try {
    const { error } = await supabase.from('access_logs').insert({
      id: log.id,
      timestamp: log.timestamp,
      relative_time: log.relativeTime,
      document_number: log.documentNumber,
      full_name: log.fullName,
      role: log.role,
      type: log.type,
      entity_type: log.entityType,
      vehicle_plate: log.vehiclePlate,
      gate: log.gate,
      celador_name: log.celadorName,
      forced: log.forced ?? false,
      forced_reason: log.forcedReason ?? null,
    });
    if (error) {
      console.warn('Could not push access log to Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Sync access log error:', err);
    return false;
  }
}

/**
 * Service to update user access status in Supabase
 */
export async function syncUserStatusToSupabase(userId: string, accessStatus: string, lastMovementTime?: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('users')
      .update({
        access_status: accessStatus,
        last_movement_time: lastMovementTime,
      })
      .eq('id', userId);
    return !error;
  } catch {
    return false;
  }
}

/**
 * Service to sync visitor to Supabase
 */
export async function syncVisitorToSupabase(visitor: Visitor): Promise<boolean> {
  try {
    const { error } = await supabase.from('visitors').insert({
      id: visitor.id,
      document_number: visitor.documentNumber,
      full_name: visitor.fullName,
      reason: visitor.reason,
      host_person_or_area: visitor.hostPersonOrArea,
      entry_date: visitor.entryDate,
      access_status: visitor.accessStatus,
      badge_code: visitor.badgeCode,
      vehicle_plate: visitor.vehiclePlate ?? null,
    });
    return !error;
  } catch {
    return false;
  }
}

/**
 * Service to sync vehicle to Supabase
 */
export async function syncVehicleToSupabase(vehicle: Vehicle): Promise<boolean> {
  try {
    const { error } = await supabase.from('vehicles').insert({
      id: vehicle.id,
      plate: vehicle.plate,
      type: vehicle.type,
      owner_doc: vehicle.ownerDoc,
      owner_name: vehicle.ownerName,
      parking_slot: vehicle.parkingSlot ?? null,
      status: vehicle.status,
    });
    return !error;
  } catch {
    return false;
  }
}

/**
 * Service to sync audit log to Supabase
 */
export async function syncAuditLogToSupabase(item: AuditLogItem): Promise<boolean> {
  try {
    const { error } = await supabase.from('audit_logs').insert({
      id: item.id,
      title: item.title,
      description: item.description,
      time: item.time,
      status: item.status,
      type: item.type,
    });
    return !error;
  } catch {
    return false;
  }
}

/**
 * Service to sync pending photo request to Supabase
 */
export async function syncPendingPhotoToSupabase(item: PendingPhotoItem): Promise<boolean> {
  try {
    const { error } = await supabase.from('pending_photos').insert({
      id: item.id,
      user_id: item.userId,
      full_name: item.fullName,
      document_number: item.documentNumber,
      role_label: item.roleLabel,
      ficha_or_info: item.fichaOrInfo,
      photo_url: item.photoUrl,
      requested_at: item.requestedAt,
      warning: item.warning ?? null,
    });
    return !error;
  } catch {
    return false;
  }
}

/**
 * Service to delete pending photo from Supabase
 */
export async function deletePendingPhotoFromSupabase(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('pending_photos').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

/**
 * Service to update carnet status and photo in Supabase
 */
export async function updateCarnetApprovalInSupabase(
  userId: string,
  photoUrl: string,
  carnetStatus: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('users')
      .update({
        photo_url: photoUrl,
        carnet_status: carnetStatus,
      })
      .eq('id', userId);
    return !error;
  } catch {
    return false;
  }
}

/**
 * Push all initial baseline data to Supabase (1-click database seeder)
 */
export async function seedAllToSupabase(
  users: User[],
  logs: AccessLog[],
  visitors: Visitor[],
  vehicles: Vehicle[],
  pendingPhotos: PendingPhotoItem[],
  auditLogs: AuditLogItem[]
): Promise<{ success: boolean; message: string; count: number }> {
  try {
    // 1. Seed users
    const dbUsers = users.map((u) => ({
      id: u.id,
      document_number: u.documentNumber,
      document_type: u.documentType,
      full_name: u.fullName,
      email: u.email,
      role: u.role,
      role_label: u.roleLabel,
      photo_url: u.photoUrl,
      carnet_status: u.carnetStatus,
      access_status: u.accessStatus,
      ficha: u.ficha ?? null,
      program_or_area: u.programOrArea,
      regional: u.regional,
      centro: u.centro,
      barcode_code128: u.barcodeCode128,
      phone: u.phone ?? null,
      blood_type: u.bloodType ?? 'O+',
      last_movement_time: u.lastMovementTime ?? null,
    }));

    const { error: userError } = await supabase.from('users').upsert(dbUsers, { onConflict: 'id' });
    if (userError) {
      return { success: false, message: `Error en tabla users: ${userError.message}`, count: 0 };
    }

    // 2. Seed access logs
    const dbLogs = logs.map((l) => ({
      id: l.id,
      timestamp: l.timestamp,
      relative_time: l.relativeTime,
      document_number: l.documentNumber,
      full_name: l.fullName,
      role: l.role,
      type: l.type,
      entity_type: l.entityType,
      vehicle_plate: l.vehiclePlate ?? null,
      gate: l.gate,
      celador_name: l.celadorName,
      forced: l.forced ?? false,
      forced_reason: l.forcedReason ?? null,
    }));
    await supabase.from('access_logs').upsert(dbLogs, { onConflict: 'id' });

    // 3. Seed visitors
    const dbVisitors = visitors.map((v) => ({
      id: v.id,
      document_number: v.documentNumber,
      full_name: v.fullName,
      reason: v.reason,
      host_person_or_area: v.hostPersonOrArea,
      entry_date: v.entryDate,
      access_status: v.accessStatus,
      badge_code: v.badgeCode,
      vehicle_plate: v.vehiclePlate ?? null,
    }));
    await supabase.from('visitors').upsert(dbVisitors, { onConflict: 'id' });

    // 4. Seed vehicles
    const dbVehicles = vehicles.map((v) => ({
      id: v.id,
      plate: v.plate,
      type: v.type,
      owner_doc: v.ownerDoc,
      owner_name: v.ownerName,
      parking_slot: v.parkingSlot ?? null,
      status: v.status,
    }));
    await supabase.from('vehicles').upsert(dbVehicles, { onConflict: 'id' });

    // 5. Seed pending photos
    const dbPhotos = pendingPhotos.map((p) => ({
      id: p.id,
      user_id: p.userId,
      full_name: p.fullName,
      document_number: p.documentNumber,
      role_label: p.roleLabel,
      ficha_or_info: p.fichaOrInfo,
      photo_url: p.photoUrl,
      requested_at: p.requestedAt,
      warning: p.warning ?? null,
    }));
    await supabase.from('pending_photos').upsert(dbPhotos, { onConflict: 'id' });

    // 6. Seed audit logs
    const dbAudit = auditLogs.map((a) => ({
      id: a.id,
      title: a.title,
      description: a.description,
      time: a.time,
      status: a.status,
      type: a.type,
    }));
    await supabase.from('audit_logs').upsert(dbAudit, { onConflict: 'id' });

    return {
      success: true,
      message: `¡Sincronización exitosa con didrauoufisvyyyirzzq.supabase.co! Se sincronizaron ${users.length} usuarios, ${logs.length} registros de acceso, ${visitors.length} visitantes y ${vehicles.length} vehículos.`,
      count: users.length + logs.length + visitors.length,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Error durante la sincronización a Supabase',
      count: 0,
    };
  }
}

/**
 * Fetch all data from Supabase if tables exist
 */
export async function fetchAllFromSupabase(): Promise<{
  users?: User[];
  accessLogs?: AccessLog[];
  visitors?: Visitor[];
  vehicles?: Vehicle[];
  pendingPhotos?: PendingPhotoItem[];
  auditLogs?: AuditLogItem[];
}> {
  try {
    const [usersRes, logsRes, visRes, vehRes, photoRes, auditRes] = await Promise.all([
      supabase.from('users').select('*').limit(100),
      supabase.from('access_logs').select('*').order('created_at', { ascending: false }).limit(100),
      supabase.from('visitors').select('*').order('created_at', { ascending: false }).limit(100),
      supabase.from('vehicles').select('*').order('registered_at', { ascending: false }).limit(100),
      supabase.from('pending_photos').select('*').order('created_at', { ascending: false }).limit(100),
      supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(100),
    ]);

    const result: any = {};

    if (usersRes.data && usersRes.data.length > 0) {
      result.users = usersRes.data.map((row: any) => ({
        id: row.id,
        documentNumber: row.document_number,
        documentType: row.document_type,
        fullName: row.full_name,
        email: row.email,
        role: row.role,
        roleLabel: row.role_label,
        photoUrl: row.photo_url,
        carnetStatus: row.carnet_status,
        accessStatus: row.access_status,
        ficha: row.ficha,
        programOrArea: row.program_or_area,
        regional: row.regional,
        centro: row.centro,
        barcodeCode128: row.barcode_code128,
        phone: row.phone,
        bloodType: row.blood_type,
        lastMovementTime: row.last_movement_time,
      }));
    }

    if (logsRes.data && logsRes.data.length > 0) {
      result.accessLogs = logsRes.data.map((row: any) => ({
        id: row.id,
        timestamp: row.timestamp,
        relativeTime: row.relative_time || 'Reciente',
        documentNumber: row.document_number,
        fullName: row.full_name,
        role: row.role,
        type: row.type,
        entityType: row.entity_type || 'USUARIO',
        vehiclePlate: row.vehicle_plate,
        gate: row.gate || 'Portería Principal',
        celadorName: row.celador_name,
        forced: Boolean(row.forced),
        forcedReason: row.forced_reason,
      }));
    }

    if (visRes.data && visRes.data.length > 0) {
      result.visitors = visRes.data.map((row: any) => ({
        id: row.id,
        documentNumber: row.document_number,
        fullName: row.full_name,
        reason: row.reason,
        hostPersonOrArea: row.host_person_or_area,
        entryDate: row.entry_date,
        accessStatus: row.access_status,
        badgeCode: row.badge_code,
        vehiclePlate: row.vehicle_plate,
      }));
    }

    if (vehRes.data && vehRes.data.length > 0) {
      result.vehicles = vehRes.data.map((row: any) => ({
        id: row.id,
        plate: row.plate,
        type: row.type,
        ownerDoc: row.owner_doc,
        ownerName: row.owner_name,
        parkingSlot: row.parking_slot,
        status: row.status,
        registeredAt: row.registered_at,
      }));
    }

    if (photoRes.data && photoRes.data.length > 0) {
      result.pendingPhotos = photoRes.data.map((row: any) => ({
        id: row.id,
        userId: row.user_id,
        fullName: row.full_name,
        documentNumber: row.document_number,
        roleLabel: row.role_label,
        fichaOrInfo: row.ficha_or_info,
        photoUrl: row.photo_url,
        requestedAt: row.requested_at,
        warning: row.warning,
      }));
    }

    if (auditRes.data && auditRes.data.length > 0) {
      result.auditLogs = auditRes.data.map((row: any) => ({
        id: row.id,
        title: row.title,
        description: row.description,
        time: row.time,
        status: row.status,
        type: row.type,
      }));
    }

    return result;
  } catch (err) {
    console.warn('Error fetching Supabase data:', err);
    return {};
  }
}

