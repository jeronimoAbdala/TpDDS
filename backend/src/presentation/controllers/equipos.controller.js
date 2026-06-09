const { equipoRepository } = require('../../infrastructure/container');
const ListarEquiposUseCase  = require('../../domain/usecases/equipos/ListarEquiposUseCase');
const ObtenerEquipoUseCase  = require('../../domain/usecases/equipos/ObtenerEquipoUseCase');

const listar = async (req, res, next) => {
  try {
    const equipos = await new ListarEquiposUseCase(equipoRepository).execute(req.query);
    res.json(equipos);
  } catch (err) { next(err); }
};

const obtenerPorId = async (req, res, next) => {
  try {
    const equipo = await new ObtenerEquipoUseCase(equipoRepository).execute(Number(req.params.id));
    res.json(equipo);
  } catch (err) { next(err); }
};

module.exports = { listar, obtenerPorId };
