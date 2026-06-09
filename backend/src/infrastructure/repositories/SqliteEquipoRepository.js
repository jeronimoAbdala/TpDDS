const { run, get, all } = require('../database/connection');
const Equipo = require('../../entities/Equipo');
const IEquipoRepository = require('../../domain/repositories/IEquipoRepository');

class SqliteEquipoRepository extends IEquipoRepository {
  _mapear(row) {
    if (!row) return null;
    return new Equipo({ ...row, requiereAutorizacion: Boolean(row.requiereAutorizacion) });
  }

  async findAll({ categoria, estado } = {}) {
    let sql = 'SELECT * FROM equipos WHERE 1=1';
    const params = [];
    if (categoria) { sql += ' AND categoria = ?'; params.push(categoria); }
    if (estado)    { sql += ' AND estado = ?';    params.push(estado);    }
    return all(sql, params).map((r) => this._mapear(r));
  }

  async findById(id) {
    return this._mapear(get('SELECT * FROM equipos WHERE id = ?', [id]));
  }

  async updateEstado(id, estado) {
    run('UPDATE equipos SET estado = ? WHERE id = ?', [estado, id]);
  }
}

module.exports = SqliteEquipoRepository;
