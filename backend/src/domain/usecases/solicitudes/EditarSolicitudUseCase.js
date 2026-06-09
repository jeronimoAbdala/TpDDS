const HistorialSolicitud = require('../../../entities/HistorialSolicitud');
const AppError = require('../../../utils/AppError');
const { validarFechas, validarDisponibilidad } = require('./_validaciones');
const ObtenerSolicitudUseCase = require('./ObtenerSolicitudUseCase');

class EditarSolicitudUseCase {
  constructor(solicitudRepository, equipoRepository, historialRepository) {
    this.solicitudRepository = solicitudRepository;
    this.equipoRepository    = equipoRepository;
    this.historialRepository = historialRepository;
    this.obtenerSolicitud    = new ObtenerSolicitudUseCase(solicitudRepository);
  }

  async execute(id, { fechaRetiro, fechaDevolucion, motivo }, usuarioId) {
    const solicitud = await this.obtenerSolicitud.execute(id);
    if (solicitud.estado !== 'pendiente') throw new AppError('Solo se pueden editar solicitudes pendientes', 400);

    const nuevaFechaRetiro     = fechaRetiro     ?? solicitud.fechaRetiro;
    const nuevaFechaDevolucion = fechaDevolucion ?? solicitud.fechaDevolucion;
    const nuevoMotivo          = motivo          ?? solicitud.motivo;

    validarFechas(nuevaFechaRetiro, nuevaFechaDevolucion);
    await validarDisponibilidad(this.solicitudRepository, this.equipoRepository, solicitud.equipoId, nuevaFechaRetiro, nuevaFechaDevolucion, id);

    const anterior = { fechaRetiro: solicitud.fechaRetiro, fechaDevolucion: solicitud.fechaDevolucion, motivo: solicitud.motivo };
    await this.solicitudRepository.update(id, { fechaRetiro: nuevaFechaRetiro, fechaDevolucion: nuevaFechaDevolucion, motivo: nuevoMotivo });

    await this.historialRepository.save(new HistorialSolicitud({
      id: null, solicitudId: id, usuarioId, accion: 'edicion',
      fechaHora: new Date().toISOString(),
      valorAnterior: JSON.stringify(anterior),
      valorNuevo: JSON.stringify({ fechaRetiro: nuevaFechaRetiro, fechaDevolucion: nuevaFechaDevolucion, motivo: nuevoMotivo }),
    }));

    return this.obtenerSolicitud.execute(id);
  }
}

module.exports = EditarSolicitudUseCase;
