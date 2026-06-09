class Equipo {
  static ESTADOS = ['disponible', 'prestado', 'mantenimiento', 'baja'];

  constructor({ id, codigoInventario, nombre, categoria, estado, ubicacion, requiereAutorizacion }) {
    this.id                   = id;
    this.codigoInventario     = codigoInventario;
    this.nombre               = nombre;
    this.categoria            = categoria;
    this.estado               = estado;
    this.ubicacion            = ubicacion;
    this.requiereAutorizacion = Boolean(requiereAutorizacion);
  }

  estaDisponible() {
    return this.estado === 'disponible';
  }

  estaOperativo() {
    return this.estado !== 'mantenimiento' && this.estado !== 'baja';
  }
}

module.exports = Equipo;
