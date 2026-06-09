const AppError = require('../../../utils/AppError');

class ObtenerSolicitudUseCase {
  constructor(solicitudRepository) {
    this.solicitudRepository = solicitudRepository;
  }

  async execute(id) {
    const solicitud = await this.solicitudRepository.findById(id);
    if (!solicitud) throw new AppError('Solicitud no encontrada', 404);
    return solicitud;
  }
}

module.exports = ObtenerSolicitudUseCase;
