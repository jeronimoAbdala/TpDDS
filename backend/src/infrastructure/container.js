const SqliteUsuarioRepository  = require('./repositories/SqliteUsuarioRepository');
const SqliteEquipoRepository   = require('./repositories/SqliteEquipoRepository');
const SqliteSolicitudRepository = require('./repositories/SqliteSolicitudRepository');
const SqliteHistorialRepository = require('./repositories/SqliteHistorialRepository');

const usuarioRepository   = new SqliteUsuarioRepository();
const equipoRepository    = new SqliteEquipoRepository();
const solicitudRepository = new SqliteSolicitudRepository();
const historialRepository = new SqliteHistorialRepository();

module.exports = { usuarioRepository, equipoRepository, solicitudRepository, historialRepository };
