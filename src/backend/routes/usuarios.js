const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuarios');

// GET /api/usuarios - Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const usuarios = await Usuario.obtenerTodos();
    res.json(usuarios);
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      detalles: error.message 
    });
  }
});

// POST /api/usuarios - Crear nuevo usuario
router.post('/', async (req, res) => {
  try {
    const { nombre, email, matricula, carrera } = req.body;
    
    // Validaciones básicas
    if (!nombre || !email || !matricula || !carrera) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const nuevoUsuario = await Usuario.crear(nombre, email, matricula, carrera);
    res.status(201).json({
      mensaje: 'Usuario creado exitosamente',
      usuario: nuevoUsuario
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ 
        error: 'El email o matrícula ya están registrados' 
      });
    }
    res.status(500).json({ 
      error: 'Error creando usuario',
      detalles: error.message 
    });
  }
});

// GET /api/usuarios/:id - Obtener usuario por ID
router.get('/:id', async (req, res) => {
  try {
    const usuario = await Usuario.obtenerPorId(req.params.id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ 
      error: 'Error obteniendo usuario',
      detalles: error.message 
    });
  }
});

module.exports = router;
