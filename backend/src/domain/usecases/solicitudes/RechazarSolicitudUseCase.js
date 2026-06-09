const HistorialSolicitud = require('../../../entities/HistorialSolicitud');
const { validarTransicion } = require('./_validaciones');
const ObtenerSolicitudUseCase = require('./ObtenerSolicitudUseCase');

class RechazarSolicitudUseCase {
  constructor(solicitudRepository, historialRepository) {
    this.solicitudRepository = solicitudRepository;
    this.historialRepository = historialRepository;
    this.obtenerSolicitud    = new ObtenerSolicitudUseCase(solicitudRepository);
  }

  async execute(id, usuarioId) {
    const solicitud = await this.obtenerSolicitud.execute(id);
    validarTransicion(solicitud, 'rechazada');

    await this.solicitudRepository.update(id, { estado: 'rechazada' });

    await this.historialRepository.save(new HistorialSolicitud({
      id: null, solicitudId: id, usuarioId, accion: 'rechazo',
      fechaHora: new Date().toISOString(),
      valorAnterior: JSON.stringify({ estado: solicitud.estado }),
      valorNuevo: JSON.stringify({ estado: 'rechazada' }),
    }));

    return this.obtenerSolicitud.execute(id);
  }
}

module.exports = RechazarSolicitudUseCase;
