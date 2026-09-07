# SENA - Plataforma Web de Control de Acceso

Aplicacion web con frontend React/Vite, persistencia en Supabase y una API Flask opcional para autenticacion y control de acceso.

## Requisitos

- Node.js 20 o superior
- Python 3.11 o superior
- Un proyecto de Supabase con acceso a PostgreSQL

## Configuracion local

1. Instala las dependencias del frontend:

   ```bash
   npm install
   ```

2. Crea `.env.local` a partir de `.env.example` y completa `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`. La clave debe ser la clave publica `anon` o `publishable`; nunca expongas una `service_role` en el frontend.

3. Instala las dependencias del backend:

   ```bash
   python -m venv .venv
   .venv\Scripts\activate
   pip install -r requirements.txt
   ```

4. Define las variables del backend:

   ```text
   SECRET_KEY=una-clave-larga-y-aleatoria
   DATABASE_URL=postgresql://postgres:CONTRASENA@HOST:5432/postgres
   ```

5. Ejecuta los servicios en terminales separadas:

   ```bash
   npm run dev
   python -m backend.app
   ```

El frontend queda disponible en `http://localhost:3000` y la API en `http://localhost:5000`.

## Base de datos

La aplicacion frontend incluye el esquema SQL en `src/lib/supabase.ts`, disponible desde el panel de integracion de Supabase. Copialo y ejecutalo una vez en el SQL Editor de Supabase antes del primer uso. Para el backend Flask, `DATABASE_URL` debe apuntar a la misma base PostgreSQL; sus tablas se crean automaticamente al iniciar.

## Despliegue en Render

El archivo `render.yaml` crea dos servicios:

- `sena-control-acceso-web`: sitio estatico Vite, construido con `npm install && npm run build` y publicado desde `dist`.
- `sena-control-acceso-api`: servicio Python ejecutado con Gunicorn mediante `backend.wsgi:application`.

1. Sube el repositorio a GitHub y crea un Blueprint en Render usando `render.yaml`.
2. En el servicio web configura `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
3. En el servicio API configura `DATABASE_URL`. Render genera `SECRET_KEY` automaticamente desde el blueprint.
4. Ejecuta el esquema de Supabase y verifica `https://TU-API.onrender.com/api/health`, que debe responder `{"status":"ok"}`.

## Despliegue con Docker Compose en Coolify

Selecciona **Docker Compose** como tipo de aplicacion y usa el archivo `docker-compose.yml`. Configura en Coolify estas variables:

```env
VITE_SUPABASE_URL=https://TU-PROYECTO.supabase.co
VITE_SUPABASE_ANON_KEY=TU_CLAVE_ANON_O_PUBLISHABLE
SECRET_KEY=UNA_CLAVE_SECRETA_LARGA
DATABASE_URL=postgresql://postgres:CONTRASENA@db.TU-PROYECTO.supabase.co:5432/postgres
```

Publica el servicio `frontend` en el dominio web y el servicio `backend` solo si necesitas exponer la API. El frontend se sirve por el puerto interno `80`; el backend escucha en el puerto `5000`.

## Comandos de verificacion

```bash
npm run lint
npm run build
python -c "from backend.wsgi import application; print(application.url_map)"
```

## Variables de entorno

`.env.example` contiene la plantilla. No subas `.env.local`, contrasenas de PostgreSQL ni claves privadas al repositorio.
