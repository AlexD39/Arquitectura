const express = require('express');
const router = express.Router();
const Pago = require('../models/pagos');

// GET /api/pagos - Obtener todos los pagos
router.get('/', async (req, res) => {
  try {
    const pagos = await Pago.obtenerTodos();
    res.json(pagos);
  } catch (error) {
    console.error('Error obteniendo pagos:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      detalles: error.message 
    });
  }
});

// POST /api/pagos - Crear nuevo pago
router.post('/', async (req, res) => {
  try {
    const { usuario_id, concepto, monto } = req.body;
    
    // Validaciones básicas
    if (!usuario_id || !concepto || !monto) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    if (isNaN(monto) || parseFloat(monto) <= 0) {
      return res.status(400).json({ error: 'El monto debe ser un número positivo' });
    }

    const nuevoPago = await Pago.crear(usuario_id, concepto, parseFloat(monto));
    res.status(201).json({
      mensaje: 'Pago registrado exitosamente',
      pago: nuevoPago
    });
  } catch (error) {
    if (error.message === 'El usuario especificado no existe') {
      return res.status(400).json({ 
        error: 'El usuario especificado no existe' 
      });
    }
    res.status(500).json({ 
      error: 'Error registrando pago',
      detalles: error.message 
    });
  }
});

// GET /api/pagos/:id - Obtener pago por ID
router.get('/:id', async (req, res) => {
  try {
    const pago = await Pago.obtenerPorId(req.params.id);
    if (!pago) {
      return res.status(404).json({ error: 'Pago no encontrado' });
    }
    res.json(pago);
  } catch (error) {
    res.status(500).json({ 
      error: 'Error obteniendo pago',
      detalles: error.message 
    });
  }
});

// GET /api/pagos/usuario/:usuario_id - Obtener pagos por usuario
router.get('/usuario/:usuario_id', async (req, res) => {
  try {
    const pagos = await Pago.obtenerPorUsuario(req.params.usuario_id);
    res.json(pagos);
  } catch (error) {
    res.status(500).json({ 
      error: 'Error obteniendo pagos del usuario',
      detalles: error.message 
    });
  }
});

// GET /api/pagos/estado/:estado - Obtener pagos por estado
router.get('/estado/:estado', async (req, res) => {
  try {
    const { estado } = req.params;
    const estadosValidos = ['pendiente', 'completado', 'cancelado'];
    
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ 
        error: 'Estado inválido. Estados válidos: pendiente, completado, cancelado' 
      });
    }

    const pagos = await Pago.obtenerPorEstado(estado);
    res.json(pagos);
  } catch (error) {
    res.status(500).json({ 
      error: 'Error obteniendo pagos por estado',
      detalles: error.message 
    });
  }
});

// PUT /api/pagos/:id/estado - Actualizar estado de pago
router.put('/:id/estado', async (req, res) => {
  try {
    const { estado } = req.body;
    const estadosValidos = ['pendiente', 'completado', 'cancelado'];
    
    if (!estado) {
      return res.status(400).json({ error: 'El estado es obligatorio' });
    }

    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ 
        error: 'Estado inválido. Estados válidos: pendiente, completado, cancelado' 
      });
    }

    const pagoActualizado = await Pago.actualizarEstado(req.params.id, estado);
    if (!pagoActualizado) {
      return res.status(404).json({ error: 'Pago no encontrado' });
    }

    res.json({
      mensaje: 'Estado de pago actualizado exitosamente',
      pago: pagoActualizado
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Error actualizando estado del pago',
      detalles: error.message 
    });
  }
});

// GET /api/pagos/estadisticas/dashboard - Obtener estadísticas para dashboard
router.get('/estadisticas/dashboard', async (req, res) => {
  try {
    const estadisticas = await Pago.obtenerEstadisticas();
    res.json(estadisticas);
  } catch (error) {
    res.status(500).json({ 
      error: 'Error obteniendo estadísticas',
      detalles: error.message 
    });
  }
});

module.exports = router;
