const equiposService = require('./equipos.service');

const listar = (req, res, next) => {
  try {
    const equipos = equiposService.listar(req.query);
    res.json(equipos);
  } catch (err) {
    next(err);
  }
};

const obtenerPorId = (req, res, next) => {
  try {
    const equipo = equiposService.obtenerPorId(Number(req.params.id));
    res.json(equipo);
  } catch (err) {
    next(err);
  }
};

module.exports = { listar, obtenerPorId };
