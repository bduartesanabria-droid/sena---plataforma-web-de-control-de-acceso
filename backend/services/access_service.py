"""
SENA - Servicio Central de Control de Acceso
Implementa el Service Pattern para validaciones de negocio estrictas.
"""

from typing import Tuple, Optional
from datetime import datetime
from backend.models import db, User, AccessLog, AccessStatusEnum, CarnetStatusEnum, AccessTypeEnum, AuditLog

class AccessService:
    @staticmethod
    def validate_and_register_access(
        user: User, 
        movement_type: AccessTypeEnum, 
        celador: User,
        gate: str = 'Portería Principal',
        forced: bool = False,
        forced_reason: Optional[str] = None
    ) -> Tuple[bool, str, Optional[AccessLog]]:
        """
        Regla de Negocio 1: Carnet debe estar ACTIVO.
        Regla de Negocio 2: Validación estricta de estado (Bloqueo de entradas/salidas consecutivas).
        Regla de Negocio 3: Excepción forzada por celador auditada con justificación obligatoria.
        """
        # 1. Validar estado del carnet
        if user.carnet_status != CarnetStatusEnum.ACTIVO:
            return False, f"ACCESO DENEGADO: El carnet de {user.full_name} se encuentra en estado '{user.carnet_status.value}'. Requiere aprobación del Administrador.", None

        # 2. Detectar incongruencia de estado
        is_double_entry = (movement_type == AccessTypeEnum.ENTRADA and user.access_status == AccessStatusEnum.EN_SEDE)
        is_double_exit = (movement_type == AccessTypeEnum.SALIDA and user.access_status == AccessStatusEnum.FUERA_DE_SEDE)

        if (is_double_entry or is_double_exit) and not forced:
            action_str = "entrada" if is_double_entry else "salida"
            status_str = "dentro de las instalaciones" if is_double_entry else "fuera de las instalaciones"
            return False, f"ESTADO INCONGRUENTE: El usuario ya figura {status_str}. Se requiere confirmación de excepción por el celador.", None

        if forced and not forced_reason:
            return False, "ERROR: Debe especificar un motivo institucional para autorizar la excepción.", None

        # 3. Registrar log de acceso
        log = AccessLog(
            user_id=user.id,
            document_number=user.document_number,
            full_name=user.full_name,
            role=user.role_label,
            type=movement_type,
            gate=gate,
            celador_id=celador.id,
            celador_name=celador.full_name,
            forced=forced,
            forced_reason=forced_reason
        )

        # 4. Actualizar estado del usuario
        user.access_status = AccessStatusEnum.EN_SEDE if movement_type == AccessTypeEnum.ENTRADA else AccessStatusEnum.FUERA_DE_SEDE

        db.session.add(log)

        # 5. Si fue forzado, registrar en pista de auditoría
        if forced:
            audit = AuditLog(
                actor_id=celador.id,
                actor_name=celador.full_name,
                action=f"Acceso Forzado: {movement_type.value}",
                description=f"Celador forzó {movement_type.value} para {user.full_name} (CC {user.document_number}). Motivo: {forced_reason}",
                status='Completado'
            )
            db.session.add(audit)

        db.session.commit()

        return True, f"{movement_type.value.capitalize()} registrada exitosamente para {user.full_name}.", log
