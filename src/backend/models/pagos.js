const pool = require('../config/database');

class Pago {
  static async crearTabla() {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS pagos (
          id SERIAL PRIMARY KEY,
          usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
          concepto VARCHAR(200) NOT NULL,
          monto DECIMAL(10,2) NOT NULL,
          estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'completado', 'cancelado')),
          referencia VARCHAR(50) UNIQUE DEFAULT NULL,
          fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('✅ Tabla de pagos lista en PostgreSQL');
    } catch (error) {
      console.error('❌ Error creando tabla pagos:', error);
    }
  }

  static async crear(usuario_id, concepto, monto) {
    try {
      // Generar referencia única
      const referencia = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
      
      const result = await pool.query(
        'INSERT INTO pagos (usuario_id, concepto, monto, referencia) VALUES ($1, $2, $3, $4) RETURNING *',
        [usuario_id, concepto, monto, referencia]
      );
      return result.rows[0];
    } catch (error) {
      if (error.code === '23503') { // Violación de foreign key
        throw new Error('El usuario especificado no existe');
      }
      throw error;
    }
  }

  static async obtenerTodos() {
    try {
      const result = await pool.query(`
        SELECT p.*, u.nombre as usuario_nombre, u.matricula, u.carrera
        FROM pagos p
        JOIN usuarios u ON p.usuario_id = u.id
        ORDER BY p.fecha_creacion DESC
      `);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async obtenerPorId(id) {
    try {
      const result = await pool.query(`
        SELECT p.*, u.nombre as usuario_nombre, u.matricula, u.carrera
        FROM pagos p
        JOIN usuarios u ON p.usuario_id = u.id
        WHERE p.id = $1
      `, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async obtenerPorUsuario(usuario_id) {
    try {
      const result = await pool.query(`
        SELECT p.*, u.nombre as usuario_nombre, u.matricula, u.carrera
        FROM pagos p
        JOIN usuarios u ON p.usuario_id = u.id
        WHERE p.usuario_id = $1
        ORDER BY p.fecha_creacion DESC
      `, [usuario_id]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async actualizarEstado(id, nuevoEstado) {
    try {
      const result = await pool.query(
        'UPDATE pagos SET estado = $1, fecha_actualizacion = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
        [nuevoEstado, id]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async obtenerPorEstado(estado) {
    try {
      const result = await pool.query(`
        SELECT p.*, u.nombre as usuario_nombre, u.matricula, u.carrera
        FROM pagos p
        JOIN usuarios u ON p.usuario_id = u.id
        WHERE p.estado = $1
        ORDER BY p.fecha_creacion DESC
      `, [estado]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async obtenerEstadisticas() {
    try {
      const result = await pool.query(`
        SELECT 
          COUNT(*) as total_pagos,
          COUNT(CASE WHEN estado = 'completado' THEN 1 END) as pagos_completados,
          COUNT(CASE WHEN estado = 'pendiente' THEN 1 END) as pagos_pendientes,
          COUNT(CASE WHEN estado = 'cancelado' THEN 1 END) as pagos_cancelados,
          COALESCE(SUM(CASE WHEN estado = 'completado' THEN monto END), 0) as monto_total_completado
        FROM pagos
      `);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Pago;
