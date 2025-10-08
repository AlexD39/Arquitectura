// Servicio de pagos con validaciones y emisión de evento interno
module.exports = function createPagosService(pagosRepo, usuariosRepo, bus) {
  return {
    async registrarPago(dto) {
      if (!dto.usuario_id) throw new Error('Usuario requerido');
      if (!dto.monto || Number(dto.monto) <= 0) throw new Error('Monto inválido');

      const usuario = await usuariosRepo.obtenerPorId(dto.usuario_id);
      if (!usuario) throw new Error('Usuario no existe');

      const pago = await pagosRepo.crearPago(dto);
      // emitir evento de dominio para handlers (notificaciones, reportes, etc.)
      try { bus.emit('pago.registrado', pago); } catch (e) { /* no bloquear flujo */ }
      return pago;
    },

    async listarPagos() {
      return pagosRepo.obtenerTodos();
    },

    async pagosPorUsuario(usuarioId) {
      return pagosRepo.obtenerPorUsuario(usuarioId);
    },

    async obtenerPago(id) {
      const p = await pagosRepo.obtenerPorId(id);
      if (!p) throw new Error('Pago no encontrado');
      return p;
    }
  };
};