"""
SENA - Blueprint Operacional de Portería y Control de Acceso
"""

from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from backend.models import db, User, AccessLog, Visitor, Vehicle, AccessTypeEnum
from backend.services.access_service import AccessService

access_bp = Blueprint('access', __name__, url_prefix='/api/access')

@access_bp.route('/scan', methods=['POST'])
@login_required
def scan_code():
    data = request.get_json() or {}
    barcode = data.get('barcode', '').strip()

    user = User.query.filter_by(barcode_code128=barcode).first()
    if not user:
        # Check if visitor badge
        visitor = Visitor.query.filter_by(badge_code=barcode).first()
        if visitor:
            return jsonify({
                'entityType': 'VISITANTE',
                'id': visitor.id,
                'fullName': visitor.full_name,
                'documentNumber': visitor.document_number,
                'roleLabel': 'Visitante',
                'reason': visitor.reason,
                'accessStatus': visitor.access_status.value
            })
        return jsonify({'error': 'Código de barras no reconocido en el sistema institucional.'}), 404

    return jsonify({
        'entityType': 'USUARIO',
        'id': user.id,
        'fullName': user.full_name,
        'documentNumber': user.document_number,
        'roleLabel': user.role_label,
        'ficha': user.ficha,
        'programOrArea': user.program_or_area,
        'photoUrl': user.photo_url,
        'carnetStatus': user.carnet_status.value,
        'accessStatus': user.access_status.value
    })

@access_bp.route('/register', methods=['POST'])
@login_required
def register_movement():
    data = request.get_json() or {}
    user_id = data.get('userId')
    movement_str = data.get('type', 'ENTRADA').upper()
    forced = data.get('forced', False)
    forced_reason = data.get('forcedReason', '')

    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'Usuario no encontrado.'}), 404

    movement_type = AccessTypeEnum.ENTRADA if movement_str == 'ENTRADA' else AccessTypeEnum.SALIDA

    success, message, log = AccessService.validate_and_register_access(
        user=user,
        movement_type=movement_type,
        celador=current_user,
        forced=forced,
        forced_reason=forced_reason
    )

    if not success:
        return jsonify({'error': message}), 400

    return jsonify({'success': True, 'message': message, 'logId': log.id if log else None})
