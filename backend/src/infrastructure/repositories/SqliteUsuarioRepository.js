const { run, get } = require('../database/connection');
const Usuario = require('../../entities/Usuario');
const IUsuarioRepository = require('../../domain/repositories/IUsuarioRepository');

class SqliteUsuarioRepository extends IUsuarioRepository {
  _mapear(row) {
    if (!row) return null;
    return new Usuario({ ...row, activo: Boolean(row.activo) });
  }

  async findById(id) {
    return this._mapear(get('SELECT * FROM usuarios WHERE id = ?', [id]));
  }

  async findByEmail(email) {
    return this._mapear(get('SELECT * FROM usuarios WHERE email = ?', [email]));
  }

  async save(usuario) {
    const { lastInsertRowid } = run(
      'INSERT INTO usuarios (nombre, email, passwordHash, rol, activo) VALUES (?, ?, ?, ?, ?)',
      [usuario.nombre, usuario.email, usuario.passwordHash, usuario.rol, usuario.activo ? 1 : 0]
    );
    return this.findById(lastInsertRowid);
  }
}

module.exports = SqliteUsuarioRepository;
