// Servicio creado con DI manual: recibe el repo como dependencia
module.exports = function createUsuariosService(usuariosRepo) {
  return {
    async crearUsuario(dto) {
      if (!dto.email) throw new Error('Email requerido');
      if (!dto.nombre) throw new Error('Nombre requerido');
      // reglas de negocio simples: email único (ejemplo)
      const existentes = await usuariosRepo.obtenerTodos();
      if (existentes.some(u => u.email === dto.email)) throw new Error('Email ya registrado');
      return usuariosRepo.crear(dto);
    },

    async listarUsuarios() {
      return usuariosRepo.obtenerTodos();
    },

    async obtenerUsuario(id) {
      const u = await usuariosRepo.obtenerPorId(id);
      if (!u) throw new Error('Usuario no encontrado');
      return u;
    },

    async actualizarUsuario(id, patch) {
      const u = await usuariosRepo.actualizar(id, patch);
      if (!u) throw new Error('Actualización falló');
      return u;
    },

    async eliminarUsuario(id) {
      return usuariosRepo.eliminar(id);
    }
  };
};