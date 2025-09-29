# 🎓 Sistema de Inscripciones y Pagos - UTT

Sistema monolítico para la **gestión de inscripciones y pagos estudiantiles**, desarrollado con **Express.js**, **React.js** y **PostgreSQL**.

---

## 🏗️ Arquitectura
Frontend (React) → Backend (Express) → PostgreSQL


---

## ✨ Características
- ✅ Gestión de estudiantes y usuarios  
- ✅ Registro de pagos e inscripciones  
- ✅ Interfaz web moderna con React  
- ✅ API RESTful con Express.js  
- ✅ Base de datos PostgreSQL  
- ✅ Contenerización con Docker  

---

## 🛠️ Stack Tecnológico
- **Frontend:** React.js, Axios, CSS3  
- **Backend:** Node.js, Express.js, CORS  
- **Base de datos:** PostgreSQL  
- **Contenerización:** Docker  
- **Variables de entorno:** dotenv  

---

## 📦 Prerrequisitos
- Node.js `16+`  
- npm `8+`  
- Docker Desktop  

---

## 🚀 Instalación Rápida

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/utt-inscripciones.git
cd utt-inscripciones

2. Configurar Base de Datos con Docker
# Crear contenedor PostgreSQL
docker run --name postgres-utt \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=inscripciones_utt \
  -p 5433:5432 \
  -d postgres:15

# Verificar que el contenedor esté corriendo
docker ps

3. Instalar dependencias del Backend
cd src/backend
npm install

4. Instalar dependencias del Frontend
cd ../frontend
npm install
```
---
🏃‍♂️ Ejecución del Sistema
---
Terminal 1 - Backend (Puerto 3000)
cd src/backend
npm run dev

Terminal 2 - Frontend (Puerto 3001)
cd src/frontend
npm start

🌐 URLs del Sistema

Frontend: http://localhost:3001

Backend: http://localhost:3000

Health Check: http://localhost:3000/api/health

---
📡 Endpoints de la API
---
Usuarios
```bash
GET    /api/usuarios                 # Listar todos los usuarios
POST   /api/usuarios                 # Crear nuevo usuario
GET    /api/usuarios/:id             # Obtener usuario específico
```
Pagos
```bash
GET    /api/pagos                    # Listar todos los pagos
POST   /api/pagos                    # Crear nuevo pago
PUT    /api/pagos/:id/estado         # Actualizar estado de pago
GET    /api/pagos/usuario/:usuarioId # Pagos por usuario
```
Sistema
```bash
GET    /api/health                   # Estado del servidor
GET    /                             # Información de la API
```
---
🧪 Pruebas de la API
---
1. Verificar salud del servidor
curl http://localhost:3000/api/health

2. Crear usuario de prueba
curl -X POST http://localhost:3000/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Ana García",
    "email": "ana@utt.edu.mx",
    "matricula": "2024001", 
    "carrera": "Ingeniería en Software"
  }'

3. Listar usuarios
curl http://localhost:3000/api/usuarios

4. Crear pago de prueba
curl -X POST http://localhost:3000/api/pagos \
  -H "Content-Type: application/json" \
  -d '{
    "usuario_id": 1,
    "concepto": "Inscripción Semestral",
    "monto": 1500.00
  }'

---
🗃️ Base de Datos PostgreSQL
---
Estructura de Tablas
-- Tabla usuarios
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  matricula VARCHAR(20) UNIQUE NOT NULL,
  carrera VARCHAR(100) NOT NULL,
  fecha_inscripcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla pagos  
CREATE TABLE pagos (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuarios(id),
  concepto VARCHAR(200) NOT NULL,
  monto DECIMAL(10,2) NOT NULL,
  estado VARCHAR(20) DEFAULT 'pendiente',
  fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  referencia VARCHAR(100) UNIQUE
);
