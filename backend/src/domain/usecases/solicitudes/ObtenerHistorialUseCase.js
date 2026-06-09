const ObtenerSolicitudUseCase = require('./ObtenerSolicitudUseCase');

class ObtenerHistorialUseCase {
  constructor(solicitudRepository, historialRepository) {
    this.obtenerSolicitud = new ObtenerSolicitudUseCase(solicitudRepository);
    this.historialRepository = historialRepository;
  }

  async execute(solicitudId) {
    await this.obtenerSolicitud.execute(solicitudId); // valida existencia
    return this.historialRepository.findBySolicitud(solicitudId);
  }
}

module.exports = ObtenerHistorialUseCase;
