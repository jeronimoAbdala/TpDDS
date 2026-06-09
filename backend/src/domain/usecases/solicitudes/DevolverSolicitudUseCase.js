const HistorialSolicitud = require('../../../entities/HistorialSolicitud');
const { validarTransicion } = require('./_validaciones');
const ObtenerSolicitudUseCase = require('./ObtenerSolicitudUseCase');

class DevolverSolicitudUseCase {
  constructor(solicitudRepository, equipoRepository, historialRepository) {
    this.solicitudRepository = solicitudRepository;
    this.equipoRepository    = equipoRepository;
    this.historialRepository = historialRepository;
    this.obtenerSolicitud    = new ObtenerSolicitudUseCase(solicitudRepository);
  }

  async execute(id, usuarioId) {
    const solicitud = await this.obtenerSolicitud.execute(id);
    validarTransicion(solicitud, 'devuelta');

    await this.solicitudRepository.update(id, { estado: 'devuelta' });
    await this.equipoRepository.updateEstado(solicitud.equipoId, 'disponible');

    await this.historialRepository.save(new HistorialSolicitud({
      id: null, solicitudId: id, usuarioId, accion: 'devolucion',
      fechaHora: new Date().toISOString(),
      valorAnterior: JSON.stringify({ estado: solicitud.estado }),
      valorNuevo: JSON.stringify({ estado: 'devuelta' }),
    }));

    return this.obtenerSolicitud.execute(id);
  }
}

module.exports = DevolverSolicitudUseCase;
