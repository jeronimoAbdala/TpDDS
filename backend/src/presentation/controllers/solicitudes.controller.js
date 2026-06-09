const { solicitudRepository, equipoRepository, historialRepository } = require('../../infrastructure/container');
const ListarSolicitudesUseCase  = require('../../domain/usecases/solicitudes/ListarSolicitudesUseCase');
const ObtenerSolicitudUseCase   = require('../../domain/usecases/solicitudes/ObtenerSolicitudUseCase');
const ObtenerHistorialUseCase   = require('../../domain/usecases/solicitudes/ObtenerHistorialUseCase');
const CrearSolicitudUseCase     = require('../../domain/usecases/solicitudes/CrearSolicitudUseCase');
const EditarSolicitudUseCase    = require('../../domain/usecases/solicitudes/EditarSolicitudUseCase');
const AprobarSolicitudUseCase   = require('../../domain/usecases/solicitudes/AprobarSolicitudUseCase');
const RechazarSolicitudUseCase  = require('../../domain/usecases/solicitudes/RechazarSolicitudUseCase');
const CancelarSolicitudUseCase  = require('../../domain/usecases/solicitudes/CancelarSolicitudUseCase');
const DevolverSolicitudUseCase  = require('../../domain/usecases/solicitudes/DevolverSolicitudUseCase');
const ResumenUseCase            = require('../../domain/usecases/solicitudes/ResumenUseCase');

const listar = async (req, res, next) => {
  try { res.json(await new ListarSolicitudesUseCase(solicitudRepository).execute(req.query)); }
  catch (err) { next(err); }
};

const resumen = async (req, res, next) => {
  try { res.json(await new ResumenUseCase(solicitudRepository, equipoRepository).execute()); }
  catch (err) { next(err); }
};

const obtenerPorId = async (req, res, next) => {
  try { res.json(await new ObtenerSolicitudUseCase(solicitudRepository).execute(Number(req.params.id))); }
  catch (err) { next(err); }
};

const obtenerHistorial = async (req, res, next) => {
  try { res.json(await new ObtenerHistorialUseCase(solicitudRepository, historialRepository).execute(Number(req.params.id))); }
  catch (err) { next(err); }
};

const crear = async (req, res, next) => {
  try {
    const solicitud = await new CrearSolicitudUseCase(solicitudRepository, equipoRepository, historialRepository).execute(req.body, req.user.id);
    res.status(201).json(solicitud);
  } catch (err) { next(err); }
};

const editar = async (req, res, next) => {
  try { res.json(await new EditarSolicitudUseCase(solicitudRepository, equipoRepository, historialRepository).execute(Number(req.params.id), req.body, req.user.id)); }
  catch (err) { next(err); }
};

const aprobar = async (req, res, next) => {
  try { res.json(await new AprobarSolicitudUseCase(solicitudRepository, equipoRepository, historialRepository).execute(Number(req.params.id), req.user)); }
  catch (err) { next(err); }
};

const rechazar = async (req, res, next) => {
  try { res.json(await new RechazarSolicitudUseCase(solicitudRepository, historialRepository).execute(Number(req.params.id), req.user.id)); }
  catch (err) { next(err); }
};

const cancelar = async (req, res, next) => {
  try { res.json(await new CancelarSolicitudUseCase(solicitudRepository, historialRepository).execute(Number(req.params.id), req.user)); }
  catch (err) { next(err); }
};

const devolver = async (req, res, next) => {
  try { res.json(await new DevolverSolicitudUseCase(solicitudRepository, equipoRepository, historialRepository).execute(Number(req.params.id), req.user.id)); }
  catch (err) { next(err); }
};

module.exports = { listar, resumen, obtenerPorId, obtenerHistorial, crear, editar, aprobar, rechazar, cancelar, devolver };
