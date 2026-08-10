# Personal Finance Tracker API

API REST para un sistema de finanzas personales: registro de usuarios, autenticación con email/verificación, OAuth (Google y GitHub), gestión de transacciones, categorías personalizables y resumen financiero.

## Stack tecnológico

- **Runtime:** Node.js + TypeScript
- **Framework:** [Fastify](https://fastify.dev) v5
- **Base de datos:** MongoDB + Mongoose
- **Autenticación:** JWT (access/refresh), verificación por código, magic links, OAuth 2.0 (Google, GitHub)
- **Emails:** Nodemailer (SMTP)
- **Uploads:** Cloudinary
- **Documentación:** Swagger UI

## Características

- Registro e inicio de sesión con verificación por código de correo
- Magic links para acceso sin contraseña
- Login social con Google y GitHub
- Gestión de perfil y avatar (Cloudinary)
- Categorías de sistema (ingresos/gastos) personalizables y categorías propias
- CRUD de transacciones con resumen financiero por período (7d, 30d, 3m, 6m)
- Rate limiting, seguridad de headers (Helmet), cookies httpOnly

## Requisitos previos

- Node.js >= 20
- pnpm >= 11 (recomendado) o npm
- MongoDB corriendo localmente o una instancia en MongoDB Atlas

## Instalación

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>
cd personal-finance-tracker-api

# 2. Instalar dependencias
pnpm install

# 3. Configurar variables de entorno
cp .env.example .env
# Edita .env con tus credenciales (ver sección "Variables de entorno")

# 4. Ejecutar en desarrollo
pnpm dev
```

El servidor arranca en `http://localhost:4000` y la documentación interactiva (Swagger) queda disponible en `http://localhost:4000/docs`.

## Variables de entorno

Todas las variables se definen en un archivo `.env` (usa `.env.example` como plantilla):

| Variable | Descripción |
| --- | --- |
| `NODE_ENV` | Entorno de ejecución (`development` o `production`) |
| `APP_URL` | URL pública de la API |
| `PORT` | Puerto del servidor |
| `MONGO_URI` | Cadena de conexión a MongoDB |
| `JWT_SECRET` | Secreto para firmar los tokens JWT |
| `COOKIE_SECRET` | Secreto para firmar cookies |
| `MAIL_HOST` / `MAIL_PORT` | Servidor SMTP |
| `MAIL_USER` / `MAIL_PASSWORD` | Credenciales SMTP (Gmail: usar App Password) |
| `MAIL_FROM` | Remitente de los correos |
| `FRONTEND_URL` | URL del frontend (CORS) |
| `CLIENT_URL` | URL base de la API para callbacks OAuth |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Credenciales de Google OAuth |
| `REDIRECT_URL` | Callback de Google OAuth |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | Credenciales de GitHub OAuth |
| `GITHUB_CALLBACK_URL` | Callback de GitHub OAuth |
| `CLOUDINARY_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Credenciales de Cloudinary |
| `IMG_SRC` | Origen de imágenes permitido (CSP) |

## Scripts

| Comando | Descripción |
| --- | --- |
| `pnpm dev` | Ejecuta el servidor en desarrollo con recarga automática |
| `pnpm build` | Compila TypeScript a la carpeta `dist` |
| `pnpm test` | Ejecuta los tests (pendiente de implementar) |

## Endpoints

### Auth (`/auth`)

| Método | Ruta | Descripción | Auth |
| --- | --- | --- | --- |
| POST | `/auth/register` | Registrar un nuevo usuario | - |
| POST | `/auth/login` | Iniciar sesión | - |
| POST | `/auth/request-code` | Solicitar código de verificación | - |
| POST | `/auth/verify-code` | Verificar código | - |
| POST | `/auth/check-email` | Verificar si un correo está registrado | - |
| POST | `/auth/magic-link-generate` | Generar magic link | - |
| POST | `/auth/verify-magic-token` | Validar magic link | - |
| POST | `/auth/refresh` | Renovar access token | - |
| POST | `/auth/logout` | Cerrar sesión | - |
| DELETE | `/auth/profile` | Eliminar la cuenta | ✅ |
| GET | `/auth/google/callback` | Callback de Google OAuth | - |
| GET | `/auth/github/callback` | Callback de GitHub OAuth | - |

### Perfil (`/auth`)

| Método | Ruta | Descripción | Auth |
| --- | --- | --- | --- |
| GET | `/auth/profile` | Obtener el perfil | ✅ |
| PATCH | `/auth/profile` | Actualizar el perfil | ✅ |
| POST | `/auth/avatar` | Subir avatar (multipart) | ✅ |

### Categorías (`/categories`)

| Método | Ruta | Descripción | Auth |
| --- | --- | --- | --- |
| GET | `/categories` | Listar categorías | ✅ |
| POST | `/categories` | Crear categoría | ✅ |
| PATCH | `/categories/:id` | Editar categoría | ✅ |
| DELETE | `/categories/:id` | Eliminar categoría | ✅ |

### Transacciones (`/transactions`)

| Método | Ruta | Descripción | Auth |
| --- | --- | --- | --- |
| GET | `/transactions` | Listar transacciones | ✅ |
| GET | `/transactions/summary` | Resumen financiero por período | ✅ |
| POST | `/transactions` | Crear transacción | ✅ |
| PATCH | `/transactions/:id` | Editar transacción | ✅ |
| DELETE | `/transactions/:id` | Eliminar transacción | ✅ |

### Parámetros (`/params`)

| Método | Ruta | Descripción | Auth |
| --- | --- | --- | --- |
| GET | `/params` | Parámetros del sistema | ✅ |

## Estructura del proyecto

```
src/
├── config/          # Configuración de servicios (mail, cloudinary)
├── controllers/     # Controladores de cada módulo
├── dtos/            # Tipos de datos de entrada/salida
├── entities/        # Interfaces de modelos (MongoDB)
├── errors/          # Errores personalizados y códigos de respuesta
├── hooks/           # Hooks de autenticación
├── plugins/         # Plugins de Fastify (cors, oauth, rate-limit, etc.)
├── routes/          # Definición de rutas y esquemas Swagger
├── schema/          # Schemas de Mongoose
├── services/        # Lógica de negocio
├── types/           # Tipos TypeScript
├── utils/           # Utilidades (jwt, email, swagger, cloudinary)
├── env.ts           # Configuración de variables de entorno
└── server.ts        # Punto de entrada del servidor
```

## Notas de seguridad

- No subir nunca el archivo `.env` al repositorio (está excluido en `.gitignore`).
- En producción: activar el plugin de Helmet (comentado en `server.ts`), usar HTTPS y secretos generados con `openssl rand -hex 64`.
- Los correos con Gmail requieren una App Password, no la contraseña normal de la cuenta.
