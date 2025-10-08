const express = require('express');
const createUsuariosService = require('../services/usuariosService');

module.exports = function createUsuariosRouter({ usuariosRepo, bus }) {
  const router = express.Router();
  const usuariosService = createUsuariosService(usuariosRepo);

  // GET /api/usuarios - Obtener todos los usuarios
  router.get('/', async (req, res, next) => {
    try {
      const usuarios = await usuariosService.listarUsuarios();
      res.json(usuarios);
    } catch (err) {
      next(err);
    }
  });

  // POST /api/usuarios - Crear nuevo usuario
  router.post('/', async (req, res, next) => {
    try {
      const nuevoUsuario = await usuariosService.crearUsuario(req.body);
      
      // Emitir evento si hay un bus disponible
      if (bus) {
        bus.emit('usuario.creado', nuevoUsuario);
      }
      
      res.status(201).json({
        mensaje: 'Usuario creado exitosamente',
        usuario: nuevoUsuario
      });
    } catch (err) {
      next(err);
    }
  });

  // GET /api/usuarios/:id - Obtener usuario por ID
  router.get('/:id', async (req, res, next) => {
    try {
      const usuario = await usuariosService.obtenerUsuario(req.params.id);
      res.json(usuario);
    } catch (err) {
      next(err);
    }
  });

  // PUT /api/usuarios/:id - Actualizar usuario
  router.put('/:id', async (req, res, next) => {
    try {
      const usuarioActualizado = await usuariosService.actualizarUsuario(
        req.params.id,
        req.body
      );
      
      if (bus) {
        bus.emit('usuario.actualizado', usuarioActualizado);
      }
      
      res.json({
        mensaje: 'Usuario actualizado exitosamente',
        usuario: usuarioActualizado
      });
    } catch (err) {
      next(err);
    }
  });

  // DELETE /api/usuarios/:id - Eliminar usuario
  router.delete('/:id', async (req, res, next) => {
    try {
      await usuariosService.eliminarUsuario(req.params.id);
      
      if (bus) {
        bus.emit('usuario.eliminado', { id: req.params.id });
      }
      
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  });

  return router;
};