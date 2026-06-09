class Usuario {
  static ROLES = ['usuario', 'encargado', 'admin'];

  constructor({ id, nombre, email, passwordHash, rol, activo }) {
    this.id           = id;
    this.nombre       = nombre;
    this.email        = email;
    this.passwordHash = passwordHash;
    this.rol          = rol;
    this.activo       = Boolean(activo);
  }

  esAdmin() {
    return ['admin', 'encargado'].includes(this.rol);
  }

  toPublic() {
    const { passwordHash, ...publico } = this;
    return publico;
  }
}

module.exports = Usuario;
