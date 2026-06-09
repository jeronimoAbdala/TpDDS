const service = require('./solicitudes.service');
const equiposService = require('../equipos/equipos.service');

const listar = (req, res, next) => {
  try {
    const solicitudes = service.listar(req.query);
    res.json(solicitudes);
  } catch (err) { next(err); }
};

const resumen = (req, res, next) => {
  try {
    res.json(service.resumen());
  } catch (err) { next(err); }
};

const obtenerPorId = (req, res, next) => {
  try {
    res.json(service.obtenerPorId(Number(req.params.id)));
  } catch (err) { next(err); }
};

const obtenerHistorial = (req, res, next) => {
  try {
    res.json(service.obtenerHistorial(Number(req.params.id)));
  } catch (err) { next(err); }
};

const crear = (req, res, next) => {
  try {
    const solicitud = service.crear(req.body, req.user.id);
    res.status(201).json(solicitud);
  } catch (err) { next(err); }
};

const editar = (req, res, next) => {
  try {
    res.json(service.editar(Number(req.params.id), req.body, req.user.id));
  } catch (err) { next(err); }
};

const cancelar = (req, res, next) => {
  try {
    const esAdmin = ['admin', 'encargado'].includes(req.user.rol);
    res.json(service.cancelar(Number(req.params.id), req.user.id, req.user.rol, esAdmin));
  } catch (err) { next(err); }
};

const aprobar = (req, res, next) => {
  try {
    const solicitud = service.obtenerPorId(Number(req.params.id));
    const equipo = equiposService.obtenerPorId(solicitud.equipoId);
    res.json(service.aprobar(Number(req.params.id), req.user, equipo.requiereAutorizacion));
  } catch (err) { next(err); }
};

const rechazar = (req, res, next) => {
  try {
    res.json(service.rechazar(Number(req.params.id), req.user.id));
  } catch (err) { next(err); }
};

const devolver = (req, res, next) => {
  try {
    res.json(service.devolver(Number(req.params.id), req.user.id));
  } catch (err) { next(err); }
};

module.exports = { listar, resumen, obtenerPorId, obtenerHistorial, crear, editar, cancelar, aprobar, rechazar, devolver };
