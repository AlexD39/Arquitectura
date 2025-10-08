const db = require('../config/database');

async function crear(usuario) {
  const q = `INSERT INTO usuarios (nombre, email, matricula, carrera)
             VALUES ($1, $2, $3, $4) RETURNING *`;
  const { rows } = await db.query(q, [usuario.nombre, usuario.email, usuario.matricula, usuario.carrera]);
  return rows[0];
}

async function obtenerPorId(id) {
  const { rows } = await db.query('SELECT * FROM usuarios WHERE id = $1', [id]);
  return rows[0];
}

async function obtenerTodos() {
  const { rows } = await db.query('SELECT * FROM usuarios ORDER BY id');
  return rows;
}

async function actualizar(id, patch) {
  const q = `UPDATE usuarios SET nombre = COALESCE($1,nombre), email = COALESCE($2,email),
             matricula = COALESCE($3,matricula), carrera = COALESCE($4,carrera)
             WHERE id = $5 RETURNING *`;
  const params = [patch.nombre, patch.email, patch.matricula, patch.carrera, id];
  const { rows } = await db.query(q, params);
  return rows[0];
}

async function eliminar(id) {
  await db.query('DELETE FROM usuarios WHERE id = $1', [id]);
  return true;
}

module.exports = {
  crear,
  obtenerPorId,
  obtenerTodos,
  actualizar,
  eliminar
};