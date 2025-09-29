const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importar modelos
const Usuario = require('./models/usuarios');
const Pago = require('./models/pagos');

// Importar rutas
const usuariosRoutes = require('./routes/usuarios');
const pagosRoutes = require('./routes/pagos');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rutas API
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/pagos', pagosRoutes);

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: '🚀 Servidor con PostgreSQL funcionando',
    database: 'PostgreSQL',
    timestamp: new Date().toISOString()
  });
});

// Ruta de inicio
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

// Función para inicializar base de datos
async function inicializarBaseDeDatos() {
  try {
    console.log('🔄 Inicializando base de datos PostgreSQL...');
    
    // Crear tablas
    await Usuario.crearTabla();
    await Pago.crearTabla();
    
    // Verificar si hay datos de prueba
    const usuarios = await Usuario.obtenerTodos();
    if (usuarios.length === 0) {
      console.log('📝 Insertando datos de prueba...');
      
      await Usuario.crear('Ana García', 'ana@utt.edu.mx', '2024001', 'Ingeniería en Software');
      await Usuario.crear('Carlos López', 'carlos@utt.edu.mx', '2024002', 'Administración');
      await Usuario.crear('María Hernández', 'maria@utt.edu.mx', '2024003', 'Contaduría');
      
      console.log('✅ Datos de prueba insertados');
    } else {
      console.log(`📊 Ya existen ${usuarios.length} usuarios en la base de datos`);
    }
    
  } catch (error) {
    console.error('❌ Error inicializando base de datos:', error);
  }
}

// Manejo de errores
app.use((error, req, res, next) => {
  console.error('Error del servidor:', error);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    detalles: error.message 
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    path: req.originalUrl
  });
});

// Iniciar servidor
app.listen(PORT, async () => {
  console.log('='.repeat(60));
  console.log('🎓 SISTEMA DE INSCRIPCIONES UTT - POSTGRESQL');
  console.log('='.repeat(60));
  
  await inicializarBaseDeDatos();
  
  console.log(`✅ Servidor ejecutándose en: http://localhost:${PORT}`);
  console.log(`🗃️  Base de datos: PostgreSQL`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log('='.repeat(60));
});
