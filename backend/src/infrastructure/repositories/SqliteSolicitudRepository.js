const { run, get, all } = require('../database/connection');
const Solicitud = require('../../entities/Solicitud');
const ISolicitudRepository = require('../../domain/repositories/ISolicitudRepository');

const COLS_ORDEN = ['id', 'fechaRetiro', 'fechaDevolucion', 'estado'];

const SELECT_ENRIQUECIDO = `
  SELECT s.*, e.nombre AS equipoNombre, e.categoria, u.nombre AS usuarioNombre
  FROM solicitudes s
  JOIN equipos  e ON s.equipoId  = e.id
  JOIN usuarios u ON s.usuarioId = u.id
`;

class SqliteSolicitudRepository extends ISolicitudRepository {
  _mapear(row) {
    if (!row) return null;
    return new Solicitud({ ...row, autorizadoPor: row.autorizadoPor ?? null });
  }

  async findAll({ estado, equipoId, categoria, desde, hasta, page = 1, limit = 10, sortBy = 'id', order = 'ASC' } = {}) {
    const col = COLS_ORDEN.includes(sortBy) ? sortBy : 'id';
    const dir = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    const offset = (Number(page) - 1) * Number(limit);

    const WHERE_BASE = `
      FROM solicitudes s
      JOIN equipos  e ON s.equipoId  = e.id
      JOIN usuarios u ON s.usuarioId = u.id
      WHERE 1=1`;
    const filterParams = [];
    let whereExtra = '';
    if (estado)    { whereExtra += ' AND s.estado = ?';           filterParams.push(estado);           }
    if (equipoId)  { whereExtra += ' AND s.equipoId = ?';         filterParams.push(Number(equipoId)); }
    if (categoria) { whereExtra += ' AND e.categoria = ?';        filterParams.push(categoria);        }
    if (desde)     { whereExtra += ' AND s.fechaRetiro >= ?';     filterParams.push(desde);            }
    if (hasta)     { whereExtra += ' AND s.fechaDevolucion <= ?'; filterParams.push(hasta);            }

    const totalRow = get(`SELECT COUNT(*) AS c ${WHERE_BASE}${whereExtra}`, filterParams);
    const total = Number(totalRow?.c ?? 0);

    const rows = all(
      `SELECT s.*, e.nombre AS equipoNombre, e.categoria, u.nombre AS usuarioNombre ${WHERE_BASE}${whereExtra} ORDER BY s.${col} ${dir} LIMIT ? OFFSET ?`,
      [...filterParams, Number(limit), offset]
    ).map((r) => this._mapear(r));

    return { data: rows, total, page: Number(page), limit: Number(limit) };
  }

  async findById(id) {
    return this._mapear(get(SELECT_ENRIQUECIDO + ' WHERE s.id = ?', [id]));
  }

  async save(solicitud) {
    const { lastInsertRowid } = run(
      'INSERT INTO solicitudes (equipoId, usuarioId, fechaRetiro, fechaDevolucion, motivo, estado, autorizadoPor) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [solicitud.equipoId, solicitud.usuarioId, solicitud.fechaRetiro, solicitud.fechaDevolucion, solicitud.motivo, solicitud.estado, solicitud.autorizadoPor]
    );
    return this.findById(lastInsertRowid);
  }

  async update(id, campos) {
    const sets = Object.keys(campos).map((k) => `${k} = ?`).join(', ');
    run(`UPDATE solicitudes SET ${sets} WHERE id = ?`, [...Object.values(campos), id]);
  }

  async tieneSuperposicion(equipoId, fechaRetiro, fechaDevolucion, excluirId = null) {
    let sql = `SELECT id FROM solicitudes WHERE equipoId = ? AND estado = 'aprobada' AND fechaRetiro < ? AND fechaDevolucion > ?`;
    const params = [equipoId, fechaDevolucion, fechaRetiro];
    if (excluirId) { sql += ' AND id != ?'; params.push(excluirId); }
    return Boolean(get(sql, params));
  }

  async contarPorEstado(estado) {
    const row = get('SELECT COUNT(*) AS c FROM solicitudes WHERE estado = ?', [estado]);
    return Number(row?.c ?? 0);
  }

  async contarVencidas(hoy) {
    const row = get("SELECT COUNT(*) AS c FROM solicitudes WHERE estado = 'aprobada' AND fechaDevolucion < ?", [hoy]);
    return Number(row?.c ?? 0);
  }
}

module.exports = SqliteSolicitudRepository;
