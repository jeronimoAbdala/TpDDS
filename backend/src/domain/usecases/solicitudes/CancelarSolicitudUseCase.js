const HistorialSolicitud = require('../../../entities/HistorialSolicitud');
const AppError = require('../../../utils/AppError');
const { validarTransicion } = require('./_validaciones');
const ObtenerSolicitudUseCase = require('./ObtenerSolicitudUseCase');

class CancelarSolicitudUseCase {
  constructor(solicitudRepository, historialRepository) {
    this.solicitudRepository = solicitudRepository;
    this.historialRepository = historialRepository;
    this.obtenerSolicitud    = new ObtenerSolicitudUseCase(solicitudRepository);
  }

  async execute(id, usuarioActual) {
    const solicitud = await this.obtenerSolicitud.execute(id);
    validarTransicion(solicitud, 'cancelada');

    const esAdmin = usuarioActual.esAdmin();
    if (!esAdmin && solicitud.usuarioId !== usuarioActual.id) {
      throw new AppError('Solo podés cancelar tus propias solicitudes', 403);
    }

    await this.solicitudRepository.update(id, { estado: 'cancelada' });

    await this.historialRepository.save(new HistorialSolicitud({
      id: null, solicitudId: id, usuarioId: usuarioActual.id, accion: 'cancelacion',
      fechaHora: new Date().toISOString(),
      valorAnterior: JSON.stringify({ estado: solicitud.estado }),
      valorNuevo: JSON.stringify({ estado: 'cancelada' }),
    }));

    return this.obtenerSolicitud.execute(id);
  }
}

module.exports = CancelarSolicitudUseCase;
