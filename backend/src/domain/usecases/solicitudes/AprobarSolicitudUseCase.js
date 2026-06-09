const HistorialSolicitud = require('../../../entities/HistorialSolicitud');
const AppError = require('../../../utils/AppError');
const { validarTransicion, validarDisponibilidad } = require('./_validaciones');
const ObtenerSolicitudUseCase = require('./ObtenerSolicitudUseCase');

class AprobarSolicitudUseCase {
  constructor(solicitudRepository, equipoRepository, historialRepository) {
    this.solicitudRepository = solicitudRepository;
    this.equipoRepository    = equipoRepository;
    this.historialRepository = historialRepository;
    this.obtenerSolicitud    = new ObtenerSolicitudUseCase(solicitudRepository);
  }

  async execute(id, usuarioAprobador) {
    const solicitud = await this.obtenerSolicitud.execute(id);
    validarTransicion(solicitud, 'aprobada');

    const equipo = await validarDisponibilidad(this.solicitudRepository, this.equipoRepository, solicitud.equipoId, solicitud.fechaRetiro, solicitud.fechaDevolucion, id);

    if (equipo.requiereAutorizacion && !usuarioAprobador.esAdmin()) {
      throw new AppError('Este equipo requiere autorización de admin o encargado', 403);
    }

    await this.solicitudRepository.update(id, { estado: 'aprobada', autorizadoPor: usuarioAprobador.id });
    await this.equipoRepository.updateEstado(solicitud.equipoId, 'prestado');

    await this.historialRepository.save(new HistorialSolicitud({
      id: null, solicitudId: id, usuarioId: usuarioAprobador.id, accion: 'aprobacion',
      fechaHora: new Date().toISOString(),
      valorAnterior: JSON.stringify({ estado: solicitud.estado }),
      valorNuevo: JSON.stringify({ estado: 'aprobada' }),
    }));

    return this.obtenerSolicitud.execute(id);
  }
}

module.exports = AprobarSolicitudUseCase;
