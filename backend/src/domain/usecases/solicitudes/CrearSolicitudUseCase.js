const Solicitud = require('../../../entities/Solicitud');
const HistorialSolicitud = require('../../../entities/HistorialSolicitud');
const { validarFechas, validarDisponibilidad } = require('./_validaciones');

class CrearSolicitudUseCase {
  constructor(solicitudRepository, equipoRepository, historialRepository) {
    this.solicitudRepository = solicitudRepository;
    this.equipoRepository    = equipoRepository;
    this.historialRepository = historialRepository;
  }

  async execute({ equipoId, fechaRetiro, fechaDevolucion, motivo }, usuarioId) {
    validarFechas(fechaRetiro, fechaDevolucion);
    await validarDisponibilidad(this.solicitudRepository, this.equipoRepository, equipoId, fechaRetiro, fechaDevolucion);

    const solicitud = new Solicitud({ id: null, equipoId: Number(equipoId), usuarioId, fechaRetiro, fechaDevolucion, motivo, estado: 'pendiente', autorizadoPor: null });
    const guardada = await this.solicitudRepository.save(solicitud);

    await this.historialRepository.save(new HistorialSolicitud({
      id: null, solicitudId: guardada.id, usuarioId, accion: 'creacion',
      fechaHora: new Date().toISOString(), valorAnterior: null,
      valorNuevo: JSON.stringify({ estado: 'pendiente' }),
    }));

    return guardada;
  }
}

module.exports = CrearSolicitudUseCase;
