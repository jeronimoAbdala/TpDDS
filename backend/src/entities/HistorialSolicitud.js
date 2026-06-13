class HistorialSolicitud {
  static ACCIONES = ['creacion', 'edicion', 'aprobacion', 'rechazo', 'cancelacion', 'devolucion'];

  constructor({ id, solicitudId, usuarioId, accion, fechaHora, valorAnterior, valorNuevo, usuarioNombre, usuarioRol, usuarioEmail }) {
    this.id             = id;
    this.solicitudId    = solicitudId;
    this.usuarioId      = usuarioId;
    this.accion         = accion;
    this.fechaHora      = fechaHora;
    this.valorAnterior  = valorAnterior ?? null;
    this.valorNuevo     = valorNuevo    ?? null;
    this.usuarioNombre  = usuarioNombre ?? null;
    this.usuarioRol     = usuarioRol    ?? null;
    this.usuarioEmail   = usuarioEmail  ?? null;
  }
}

module.exports = HistorialSolicitud;
