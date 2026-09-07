"""
SENA - Blueprint de Autenticación y Sesiones
"""

from flask import Blueprint, request, jsonify, session
from flask_login import login_user, logout_user, login_required, current_user
from backend.models import db, User

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    document = data.get('documentNumber', '').strip()
    password = data.get('password', '')

    user = User.query.filter_by(document_number=document).first()
    if not user or not user.check_password(password):
        return jsonify({'error': 'Documento o contraseña inválidos.'}), 401

    login_user(user, remember=True)
    return jsonify({
        'id': user.id,
        'documentNumber': user.document_number,
        'fullName': user.full_name,
        'role': user.role.value,
        'roleLabel': user.role_label,
        'carnetStatus': user.carnet_status.value,
        'accessStatus': user.access_status.value
    })

@auth_bp.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Sesión cerrada correctamente.'})

@auth_bp.route('/me', methods=['GET'])
@login_required
def get_current_user():
    return jsonify({
        'id': current_user.id,
        'documentNumber': current_user.document_number,
        'fullName': current_user.full_name,
        'role': current_user.role.value,
        'roleLabel': current_user.role_label,
        'carnetStatus': current_user.carnet_status.value,
        'accessStatus': current_user.access_status.value,
        'photoUrl': current_user.photo_url
    })
