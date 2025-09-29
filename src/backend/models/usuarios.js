const pool = require('../config/database');

class Usuario {
  static async crearTabla() {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS usuarios (
          id SERIAL PRIMARY KEY,
          nombre VARCHAR(100) NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          matricula VARCHAR(20) UNIQUE NOT NULL,
          carrera VARCHAR(100) NOT NULL,
          fecha_inscripcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('✅ Tabla de usuarios lista en PostgreSQL');
    } catch (error) {
      console.error('❌ Error creando tabla usuarios:', error);
    }
  }

  static async crear(nombre, email, matricula, carrera) {
    try {
      const result = await pool.query(
        'INSERT INTO usuarios (nombre, email, matricula, carrera) VALUES ($1, $2, $3, $4) RETURNING *',
        [nombre, email, matricula, carrera]
      );
      return result.rows[0];
    } catch (error) {
      if (error.code === '23505') { // Violación de unique constraint
        throw new Error('El email o matrícula ya existen');
      }
      throw error;
    }
  }

  static async obtenerTodos() {
    try {
      const result = await pool.query('SELECT * FROM usuarios ORDER BY fecha_inscripcion DESC');
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async obtenerPorId(id) {
    try {
      const result = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Usuario;