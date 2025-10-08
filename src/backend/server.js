require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Configuración de base de datos y dependencias
const db = require('./config/database'); // Debe exportar un Pool o cliente compatible con query() y end()
const usuariosRepo = require('./repositories/usuariosRepository');
const pagosRepo = require('./repositories/pagosRepository');
const bus = require('./events/bus');

// Rutas (factories que reciben dependencias)
const createUsuariosRouter = require('./routes/usuarios');
const createPagosRouter = require('./routes/pagos');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(cors());
app.use(express.json());

// Logger simple
app.use((req, res, next) => {
console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
next();
});

// Rutas API (inyección de dependencias)
app.use('/api/usuarios', createUsuariosRouter({ usuariosRepo, bus }));
app.use('/api/pagos', createPagosRouter({ pagosRepo, usuariosRepo, bus }));

// Ruta de salud
app.get('/api/health', (req, res) => {
res.json({
status: 'OK',
message: '🚀 Servidor con PostgreSQL funcionando correctamente',
database: 'PostgreSQL',
timestamp: new Date().toISOString()
});
});

// Ruta raíz
app.get('/', (req, res) => {
res.json({
message: 'Bienvenido al Sistema de Inscripciones UTT - PostgreSQL',
endpoints: {
usuarios: '/api/usuarios',
pagos: '/api/pagos',
health: '/api/health'
}
});
});

// Listeners de eventos
bus.on('pago.registrado', (pago) => {
console.log('📢 Evento "pago.registrado" recibido:', pago.id || pago);
// Aquí puedes agregar lógica adicional (notificaciones, logs externos, etc.)
});

bus.on('usuario.creado', (usuario) => {
console.log('👤 Evento "usuario.creado" recibido:', usuario.id || usuario);
});

// Inicializar base de datos
async function inicializarBaseDeDatos() {
try {
await db.query('SELECT 1');
console.log('✅ Conexión a la base de datos establecida');
} catch (err) {
console.error('❌ Error al conectar con la base de datos:', err.message);
throw err;
}
}

// Iniciar servidor
const server = app.listen(PORT, async () => {
try {
await inicializarBaseDeDatos();
console.log('='.repeat(60));
console.log('🎓 SISTEMA DE INSCRIPCIONES UTT - POSTGRESQL');
console.log('='.repeat(60));
console.log(`✅ Servidor en ejecución: http://localhost:${PORT}`);
console.log(`🗃️  Base de datos: PostgreSQL`);
console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
console.log('='.repeat(60));
} catch (err) {
console.error('⚠️ Fallo al iniciar la aplicación, cerrando...');
server.close(() => process.exit(1));
}
});

// Middleware de manejo de errores
app.use((error, req, res, next) => {
console.error('Error del servidor:', error);
res.status(error.status || 500).json({
error: error.message || 'Error interno del servidor'
});
});

// Manejo de rutas no encontradas
app.use((req, res) => {
res.status(404).json({
error: 'Ruta no encontrada',
path: req.originalUrl
});
});

// Cierre controlado (graceful shutdown)
async function shutdown() {
console.log('\n🛑 Cerrando servidor...');
server.close(() => console.log('HTTP server cerrado'));
if (db && typeof db.end === 'function') {
try {
await db.end();
console.log('🔒 Conexión a base de datos cerrada');
} catch (e) {
console.error('Error cerrando la conexión a la BD:', e.message);
}
}
process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
