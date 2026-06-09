const AppError = require('../../../utils/AppError');

const validarFechas = (fechaRetiro, fechaDevolucion) => {
  if (new Date(fechaRetiro) >= new Date(fechaDevolucion)) {
    throw new AppError('fechaDevolucion debe ser posterior a fechaRetiro', 400);
  }
};

const validarDisponibilidad = async (solicitudRepository, equipoRepository, equipoId, fechaRetiro, fechaDevolucion, excluirId = null) => {
  const equipo = await equipoRepository.findById(equipoId);
  if (!equipo) throw new AppError('Equipo no encontrado', 404);
  if (!equipo.estaOperativo()) throw new AppError(`El equipo no está disponible (estado: ${equipo.estado})`, 400);

  const superposicion = await solicitudRepository.tieneSuperposicion(equipoId, fechaRetiro, fechaDevolucion, excluirId);
  if (superposicion) throw new AppError('El equipo ya tiene una solicitud aprobada para ese período', 400);

  return equipo;
};

const validarTransicion = (solicitud, nuevoEstado) => {
  if (!solicitud.puedeTransicionarA(nuevoEstado)) {
    throw new AppError(`No se puede pasar de "${solicitud.estado}" a "${nuevoEstado}"`, 400);
  }
};

module.exports = { validarFechas, validarDisponibilidad, validarTransicion };
