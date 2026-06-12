const { run, all } = require('../database/connection');
const HistorialSolicitud = require('../../entities/HistorialSolicitud');
const IHistorialRepository = require('../../domain/repositories/IHistorialRepository');

class SqliteHistorialRepository extends IHistorialRepository {
  _mapear(row) {
    if (!row) return null;
    return new HistorialSolicitud(row);
  }

  async findBySolicitud(solicitudId) {
    return all(
      `SELECT h.*, u.nombre AS usuarioNombre, u.rol AS usuarioRol, u.email AS usuarioEmail
       FROM historial_solicitudes h
       JOIN usuarios u ON h.usuarioId = u.id
       WHERE h.solicitudId = ?
       ORDER BY h.fechaHora ASC`,
      [solicitudId]
    ).map((r) => this._mapear(r));
  }

  async save(entrada) {
    run(
      'INSERT INTO historial_solicitudes (solicitudId, usuarioId, accion, fechaHora, valorAnterior, valorNuevo) VALUES (?, ?, ?, ?, ?, ?)',
      [entrada.solicitudId, entrada.usuarioId, entrada.accion, entrada.fechaHora, entrada.valorAnterior, entrada.valorNuevo]
    );
  }
}

module.exports = SqliteHistorialRepository;
