"""
SENA - Plataforma Web de Control de Acceso
Aplicación Principal Flask estructurada en Blueprints.
"""

import os
from flask import Flask
from flask_login import LoginManager
from backend.models import db, User
from backend.routes.auth_bp import auth_bp
from backend.routes.access_bp import access_bp
from backend.routes.admin_bp import admin_bp

def create_app():
    app = Flask(__name__)
    
    # Configuración de Seguridad y Base de Datos (Supabase PostgreSQL / SQLite local)
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'sena-seguridad-operacional-llave-secreta-2024')
    # Para producción con Supabase: export DATABASE_URL="postgresql://postgres:[TU_PASSWORD]@db.didrauoufisvyyyirzzq.supabase.co:5432/postgres"
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///sena_acceso.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Cookies de sesión seguras
    app.config['SESSION_COOKIE_HTTPONLY'] = True
    app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'

    # Inicialización de DB
    db.init_app(app)

    # Inicialización de Flask-Login
    login_manager = LoginManager()
    login_manager.init_app(app)
    login_manager.login_view = 'auth.login'

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    # Registro de Blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(access_bp)
    app.register_blueprint(admin_bp)

    with app.app_context():
        db.create_all()

    return app

if __name__ == '__main__':
    application = create_app()
    application.run(host='0.0.0.0', port=5000, debug=True)
