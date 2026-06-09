const db = require('../../config/database');
const AppError = require('../../utils/AppError');

const listar = ({ categoria, estado } = {}) => {
  let query = db.get('equipos');
  if (categoria) query = query.filter({ categoria });
  if (estado)    query = query.filter({ estado });
  return query.value();
};

const obtenerPorId = (id) => {
  const equipo = db.get('equipos').find({ id: Number(id) }).value();
  if (!equipo) throw new AppError('Equipo no encontrado', 404);
  return equipo;
};

module.exports = { listar, obtenerPorId };
