"""
SENA - Blueprint de Administración y Auditoría
"""

from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from backend.models import db, User, CarnetStatusEnum, AuditLog

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')

def admin_required(func):
    def wrapper(*args, **kwargs):
        if not current_user.is_authenticated or current_user.role.value != 'admin':
            return jsonify({'error': 'Acceso no autorizado. Requiere rol de Administrador.'}), 403
        return func(*args, **kwargs)
    wrapper.__name__ = func.__name__
    return wrapper

@admin_bp.route('/pending-photos', methods=['GET'])
@login_required
@admin_required
def get_pending_photos():
    users = User.query.filter_by(carnet_status=CarnetStatusEnum.PENDIENTE_FOTO).all()
    return jsonify([{
        'id': u.id,
        'fullName': u.full_name,
        'documentNumber': u.document_number,
        'roleLabel': u.role_label,
        'ficha': u.ficha,
        'photoUrl': u.photo_url
    } for u in users])

@admin_bp.route('/approve-photo/<int:user_id>', methods=['POST'])
@login_required
@admin_required
def approve_photo(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'Usuario no encontrado.'}), 404

    user.carnet_status = CarnetStatusEnum.ACTIVO

    audit = AuditLog(
        actor_id=current_user.id,
        actor_name=current_user.full_name,
        action='Aprobación de Fotografía',
        description=f"Administrador aprobó credencial para {user.full_name} ({user.document_number}).",
        status='Completado'
    )
    db.session.add(audit)
    db.session.commit()

    return jsonify({'success': True, 'message': f'Carnet de {user.full_name} activado exitosamente.'})

@admin_bp.route('/reject-photo/<int:user_id>', methods=['POST'])
@login_required
@admin_required
def reject_photo(user_id):
    data = request.get_json() or {}
    reason = data.get('reason', 'Fotografía no cumple especificaciones biométricas')

    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'Usuario no encontrado.'}), 404

    user.carnet_status = CarnetStatusEnum.RECHAZADO

    audit = AuditLog(
        actor_id=current_user.id,
        actor_name=current_user.full_name,
        action='Rechazo de Fotografía',
        description=f"Administrador rechazó fotografía para {user.full_name}. Motivo: {reason}",
        status='Bloqueado'
    )
    db.session.add(audit)
    db.session.commit()

    return jsonify({'success': True, 'message': f'Fotografía rechazada. Motivo: {reason}'})
