const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: '🚀 Servidor con PostgreSQL funcionando',
    database: 'PostgreSQL',
    timestamp: new Date().toISOString()
  });
});

// Ruta principal
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

// Iniciar servidor
app.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log('🎓 SISTEMA DE INSCRIPCIONES UTT - POSTGRESQL');
  console.log('='.repeat(60));
  console.log(`✅ Servidor ejecutándose en: http://localhost:${PORT}`);
  console.log(`🗃️  Base de datos: PostgreSQL`);
  console.log('='.repeat(60));
});