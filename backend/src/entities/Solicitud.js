class Solicitud {
  static ESTADOS = ['pendiente', 'aprobada', 'rechazada', 'cancelada', 'devuelta'];

  static TRANSICIONES = {
    pendiente: ['aprobada', 'rechazada', 'cancelada'],
    aprobada:  ['cancelada', 'devuelta'],
  };

  constructor({ id, equipoId, usuarioId, fechaRetiro, fechaDevolucion, motivo, estado, autorizadoPor,
                equipoNombre, categoria, usuarioNombre }) {
    this.id              = id;
    this.equipoId        = equipoId;
    this.usuarioId       = usuarioId;
    this.fechaRetiro     = fechaRetiro;
    this.fechaDevolucion = fechaDevolucion;
    this.motivo          = motivo;
    this.estado          = estado;
    this.autorizadoPor   = autorizadoPor ?? null;
    // campos enriquecidos (opcionales, vienen de JOIN)
    this.equipoNombre    = equipoNombre  ?? null;
    this.categoria       = categoria     ?? null;
    this.usuarioNombre   = usuarioNombre ?? null;
  }

  puedeTransicionarA(nuevoEstado) {
    return (Solicitud.TRANSICIONES[this.estado] ?? []).includes(nuevoEstado);
  }

  fechasValidas() {
    return new Date(this.fechaRetiro) < new Date(this.fechaDevolucion);
  }

  estaVencida() {
    return this.estado === 'aprobada' && new Date(this.fechaDevolucion) < new Date();
  }
}

module.exports = Solicitud;
