const db = require('../config/database');

async function crearPago(pago) {
  const q = `INSERT INTO pagos (usuario_id, monto, metodo, referencia, fecha)
             VALUES ($1, $2, $3, $4, COALESCE($5, now())) RETURNING *`;
  const params = [pago.usuario_id, pago.monto, pago.metodo, pago.referencia, pago.fecha];
  const { rows } = await db.query(q, params);
  return rows[0];
}

async function obtenerPorId(id) {
  const { rows } = await db.query('SELECT * FROM pagos WHERE id = $1', [id]);
  return rows[0];
}

async function obtenerPorUsuario(usuarioId) {
  const { rows } = await db.query('SELECT * FROM pagos WHERE usuario_id = $1 ORDER BY fecha DESC', [usuarioId]);
  return rows;
}

async function obtenerTodos() {
  const { rows } = await db.query('SELECT * FROM pagos ORDER BY fecha DESC');
  return rows;
}

module.exports = {
  crearPago,
  obtenerPorId,
  obtenerPorUsuario,
  obtenerTodos
};