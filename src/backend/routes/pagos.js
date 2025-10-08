const express = require('express');
const createPagosService = require('../services/pagosService');

module.exports = function createPagosRouter({ pagosRepo, usuariosRepo, bus }) {
  const router = express.Router();
  const pagosService = createPagosService(pagosRepo, usuariosRepo, bus);

  // GET /api/pagos - Obtener todos los pagos
  router.get('/', async (req, res, next) => {
    try {
      const pagos = await pagosService.listarPagos();
      res.json(pagos);
    } catch (err) {
      next(err);
    }
  });

  // POST /api/pagos - Crear nuevo pago
  router.post('/', async (req, res, next) => {
    try {
      const nuevoPago = await pagosService.registrarPago(req.body);
      res.status(201).json({
        mensaje: 'Pago registrado exitosamente',
        pago: nuevoPago
      });
    } catch (err) {
      next(err);
    }
  });

  // GET /api/pagos/estadisticas/dashboard - Obtener estadísticas para dashboard
  router.get('/estadisticas/dashboard', async (req, res, next) => {
    try {
      const estadisticas = await pagosService.obtenerEstadisticas();
      res.json(estadisticas);
    } catch (err) {
      next(err);
    }
  });

  // GET /api/pagos/estado/:estado - Obtener pagos por estado
  router.get('/estado/:estado', async (req, res, next) => {
    try {
      const pagos = await pagosService.pagosPorEstado(req.params.estado);
      res.json(pagos);
    } catch (err) {
      next(err);
    }
  });

  // GET /api/pagos/usuario/:usuario_id - Obtener pagos por usuario
  router.get('/usuario/:usuarioId', async (req, res, next) => {
    try {
      const pagos = await pagosService.pagosPorUsuario(req.params.usuarioId);
      res.json(pagos);
    } catch (err) {
      next(err);
    }
  });

  // GET /api/pagos/:id - Obtener pago por ID
  router.get('/:id', async (req, res, next) => {
    try {
      const pago = await pagosService.obtenerPago(req.params.id);
      res.json(pago);
    } catch (err) {
      next(err);
    }
  });

  // PUT /api/pagos/:id/estado - Actualizar estado de pago
  router.put('/:id/estado', async (req, res, next) => {
    try {
      const pagoActualizado = await pagosService.actualizarEstadoPago(
        req.params.id,
        req.body.estado
      );
      res.json({
        mensaje: 'Estado de pago actualizado exitosamente',
        pago: pagoActualizado
      });
    } catch (err) {
      next(err);
    }
  });

  return router;
};