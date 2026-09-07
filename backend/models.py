"""
SENA - Plataforma Web de Control de Acceso
Modelos SQLAlchemy y estructura de base de datos relacional (PostgreSQL / SQLite).
"""

from datetime import datetime
from enum import Enum
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class RoleEnum(str, Enum):
    ADMIN = 'admin'
    CELADOR = 'celador'
    APRENDIZ = 'aprendiz'
    INSTRUCTOR = 'instructor'
    CONTRATISTA = 'contratista'
    FUNCIONARIO = 'funcionario'
    SUBDIRECTOR = 'subdirector'

class AccessStatusEnum(str, Enum):
    EN_SEDE = 'EN_SEDE'
    FUERA_DE_SEDE = 'FUERA_DE_SEDE'

class CarnetStatusEnum(str, Enum):
    ACTIVO = 'ACTIVO'
    PENDIENTE_FOTO = 'PENDIENTE_FOTO'
    RECHAZADO = 'RECHAZADO'
    INACTIVO = 'INACTIVO'

class AccessTypeEnum(str, Enum):
    ENTRADA = 'ENTRADA'
    SALIDA = 'SALIDA'

class User(UserMixin, db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    document_number = db.Column(db.String(20), unique=True, nullable=False, index=True)
    document_type = db.Column(db.String(10), default='CC', nullable=False)
    full_name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=True)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.Enum(RoleEnum), nullable=False, default=RoleEnum.APRENDIZ)
    role_label = db.Column(db.String(50), nullable=False)

    # SENA Academic / Organizational Context
    ficha = db.Column(db.String(30), nullable=True)
    program_or_area = db.Column(db.String(120), nullable=False)
    regional = db.Column(db.String(100), default='Regional Distrito Capital')
    centro = db.Column(db.String(100), default='Centro de Gestión de Mercados, Logística y TIC')

    # Security & Access state
    photo_url = db.Column(db.String(255), nullable=True)
    barcode_code128 = db.Column(db.String(50), unique=True, nullable=False, index=True)
    carnet_status = db.Column(db.Enum(CarnetStatusEnum), default=CarnetStatusEnum.PENDIENTE_FOTO, nullable=False)
    access_status = db.Column(db.Enum(AccessStatusEnum), default=AccessStatusEnum.FUERA_DE_SEDE, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password: str):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)


class AccessLog(db.Model):
    __tablename__ = 'access_logs'

    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, nullable=False, index=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    visitor_id = db.Column(db.Integer, db.ForeignKey('visitors.id'), nullable=True)
    
    document_number = db.Column(db.String(20), nullable=False)
    full_name = db.Column(db.String(120), nullable=False)
    role = db.Column(db.String(50), nullable=False)
    type = db.Column(db.Enum(AccessTypeEnum), nullable=False)
    gate = db.Column(db.String(50), default='Portería Principal')
    celador_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    celador_name = db.Column(db.String(100), nullable=False)

    # Novedad y Forzado
    forced = db.Column(db.Boolean, default=False)
    forced_reason = db.Column(db.String(255), nullable=True)


class Visitor(db.Model):
    __tablename__ = 'visitors'

    id = db.Column(db.Integer, primary_key=True)
    document_number = db.Column(db.String(20), nullable=False, index=True)
    full_name = db.Column(db.String(120), nullable=False)
    reason = db.Column(db.String(255), nullable=False)
    host_person_or_area = db.Column(db.String(120), nullable=False)
    badge_code = db.Column(db.String(50), unique=True, nullable=False)
    access_status = db.Column(db.Enum(AccessStatusEnum), default=AccessStatusEnum.EN_SEDE)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class Vehicle(db.Model):
    __tablename__ = 'vehicles'

    id = db.Column(db.Integer, primary_key=True)
    plate = db.Column(db.String(10), unique=True, nullable=False, index=True)
    type = db.Column(db.String(20), nullable=False)  # MOTO, CARRO, BICICLETA
    owner_doc = db.Column(db.String(20), nullable=False)
    owner_name = db.Column(db.String(120), nullable=False)
    parking_slot = db.Column(db.String(50), nullable=True)
    status = db.Column(db.Enum(AccessStatusEnum), default=AccessStatusEnum.EN_SEDE)
    registered_at = db.Column(db.DateTime, default=datetime.utcnow)


class AuditLog(db.Model):
    __tablename__ = 'audit_logs'

    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    actor_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    actor_name = db.Column(db.String(100), nullable=False)
    action = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    ip_address = db.Column(db.String(45), nullable=True)
    status = db.Column(db.String(30), default='Completado')
