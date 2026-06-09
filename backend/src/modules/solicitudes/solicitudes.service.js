const db = require('../../config/database');
const nextId = require('../../utils/nextId');
const AppError = require('../../utils/AppError');

// ─── helpers privados ─────────────────────────────────────────────────────────

const registrarHistorial = (solicitudId, usuarioId, accion, anterior, nuevo) => {
  db.get('historial_solicitudes').push({
    id: nextId('historial_solicitudes'),
    solicitudId,
    usuarioId,
    accion,
    fechaHora: new Date().toISOString(),
    valorAnterior: anterior ? JSON.stringify(anterior) : null,
    valorNuevo:    nuevo    ? JSON.stringify(nuevo)    : null,
  }).write();
};

const validarFechas = (fechaRetiro, fechaDevolucion) => {
  if (new Date(fechaRetiro) >= new Date(fechaDevolucion)) {
    throw new AppError('fechaDevolucion debe ser posterior a fechaRetiro', 400);
  }
};

const fechasSuperpuestas = (retiro1, dev1, retiro2, dev2) =>
  new Date(retiro1) < new Date(dev2) && new Date(dev1) > new Date(retiro2);

const validarDisponibilidad = (equipoId, fechaRetiro, fechaDevolucion, excluirId = null) => {
  const equipo = db.get('equipos').find({ id: Number(equipoId) }).value();
  if (!equipo) throw new AppError('Equipo no encontrado', 404);
  if (equipo.estado === 'mantenimiento' || equipo.estado === 'baja') {
    throw new AppError(`El equipo no está disponible (estado: ${equipo.estado})`, 400);
  }

  const superposicion = db.get('solicitudes').find((s) =>
    s.equipoId === Number(equipoId) &&
    s.estado === 'aprobada' &&
    s.id !== excluirId &&
    fechasSuperpuestas(s.fechaRetiro, s.fechaDevolucion, fechaRetiro, fechaDevolucion)
  ).value();

  if (superposicion) {
    throw new AppError('El equipo ya tiene una solicitud aprobada para ese período', 400);
  }

  return equipo;
};

const TRANSICIONES_VALIDAS = {
  pendiente: ['aprobada', 'rechazada', 'cancelada'],
  aprobada:  ['cancelada', 'devuelta'],
};

const validarTransicion = (estadoActual, estadoNuevo) => {
  if (!(TRANSICIONES_VALIDAS[estadoActual] || []).includes(estadoNuevo)) {
    throw new AppError(`No se puede pasar de "${estadoActual}" a "${estadoNuevo}"`, 400);
  }
};

const enriquecer = (solicitud) => {
  if (!solicitud) return null;
  const equipo  = db.get('equipos').find({ id: solicitud.equipoId }).value();
  const usuario = db.get('usuarios').find({ id: solicitud.usuarioId }).value();
  return {
    ...solicitud,
    equipoNombre:  equipo?.nombre,
    categoria:     equipo?.categoria,
    usuarioNombre: usuario?.nombre,
  };
};

// ─── queries públicos ─────────────────────────────────────────────────────────

const COLUMNAS_ORDEN = ['id', 'fechaRetiro', 'fechaDevolucion', 'estado'];

const listar = ({ estado, equipoId, categoria, desde, hasta, page = 1, limit = 10, sortBy = 'id', order = 'ASC' } = {}) => {
  const col = COLUMNAS_ORDEN.includes(sortBy) ? sortBy : 'id';
  const dir = order.toUpperCase() === 'DESC' ? -1 : 1;
  const offset = (Number(page) - 1) * Number(limit);

  let items = db.get('solicitudes').value();

  if (estado)   items = items.filter((s) => s.estado === estado);
  if (equipoId) items = items.filter((s) => s.equipoId === Number(equipoId));
  if (desde)    items = items.filter((s) => s.fechaRetiro >= desde);
  if (hasta)    items = items.filter((s) => s.fechaDevolucion <= hasta);

  if (categoria) {
    const equiposCat = db.get('equipos').filter({ categoria }).map('id').value();
    items = items.filter((s) => equiposCat.includes(s.equipoId));
  }

  items.sort((a, b) => (a[col] > b[col] ? dir : a[col] < b[col] ? -dir : 0));
  return items.slice(offset, offset + Number(limit)).map(enriquecer);
};

const obtenerPorId = (id) => {
  const solicitud = db.get('solicitudes').find({ id: Number(id) }).value();
  if (!solicitud) throw new AppError('Solicitud no encontrada', 404);
  return enriquecer(solicitud);
};

const obtenerHistorial = (solicitudId) => {
  obtenerPorId(solicitudId);
  return db.get('historial_solicitudes')
    .filter({ solicitudId: Number(solicitudId) })
    .sortBy('fechaHora')
    .map((h) => {
      const u = db.get('usuarios').find({ id: h.usuarioId }).value();
      return { ...h, usuarioNombre: u?.nombre };
    })
    .value();
};

const crear = ({ equipoId, fechaRetiro, fechaDevolucion, motivo }, usuarioId) => {
  validarFechas(fechaRetiro, fechaDevolucion);
  validarDisponibilidad(equipoId, fechaRetiro, fechaDevolucion);

  const nueva = {
    id: nextId('solicitudes'),
    equipoId: Number(equipoId),
    usuarioId,
    fechaRetiro,
    fechaDevolucion,
    motivo,
    estado: 'pendiente',
    autorizadoPor: null,
  };
  db.get('solicitudes').push(nueva).write();
  registrarHistorial(nueva.id, usuarioId, 'creacion', null, { estado: 'pendiente' });
  return enriquecer(nueva);
};

const editar = (id, { fechaRetiro, fechaDevolucion, motivo }, usuarioId) => {
  const solicitud = obtenerPorId(id);
  if (solicitud.estado !== 'pendiente') throw new AppError('Solo se pueden editar solicitudes pendientes', 400);

  const nuevaFechaRetiro     = fechaRetiro     ?? solicitud.fechaRetiro;
  const nuevaFechaDevolucion = fechaDevolucion ?? solicitud.fechaDevolucion;
  const nuevoMotivo          = motivo          ?? solicitud.motivo;

  validarFechas(nuevaFechaRetiro, nuevaFechaDevolucion);
  validarDisponibilidad(solicitud.equipoId, nuevaFechaRetiro, nuevaFechaDevolucion, id);

  const anterior = { fechaRetiro: solicitud.fechaRetiro, fechaDevolucion: solicitud.fechaDevolucion, motivo: solicitud.motivo };
  db.get('solicitudes').find({ id }).assign({ fechaRetiro: nuevaFechaRetiro, fechaDevolucion: nuevaFechaDevolucion, motivo: nuevoMotivo }).write();

  registrarHistorial(id, usuarioId, 'edicion', anterior, { fechaRetiro: nuevaFechaRetiro, fechaDevolucion: nuevaFechaDevolucion, motivo: nuevoMotivo });
  return obtenerPorId(id);
};

const cambiarEstado = (id, nuevoEstado, usuarioId, accion, extras = {}) => {
  const solicitud = obtenerPorId(id);
  validarTransicion(solicitud.estado, nuevoEstado);
  db.get('solicitudes').find({ id }).assign({ estado: nuevoEstado, ...extras }).write();
  registrarHistorial(id, usuarioId, accion, { estado: solicitud.estado }, { estado: nuevoEstado });
  return obtenerPorId(id);
};

const aprobar = (id, usuarioAprobador, equipoRequiereAuth) => {
  if (equipoRequiereAuth && !['admin', 'encargado'].includes(usuarioAprobador.rol)) {
    throw new AppError('Este equipo requiere autorización de admin o encargado', 403);
  }
  const solicitud = obtenerPorId(id);
  validarDisponibilidad(solicitud.equipoId, solicitud.fechaRetiro, solicitud.fechaDevolucion, id);

  const result = cambiarEstado(id, 'aprobada', usuarioAprobador.id, 'aprobacion', { autorizadoPor: usuarioAprobador.id });
  db.get('equipos').find({ id: solicitud.equipoId }).assign({ estado: 'prestado' }).write();
  return result;
};

const rechazar = (id, usuarioId) => cambiarEstado(id, 'rechazada', usuarioId, 'rechazo');

const cancelar = (id, usuarioId, esAdmin) => {
  const solicitud = obtenerPorId(id);
  if (!esAdmin && solicitud.usuarioId !== usuarioId) {
    throw new AppError('Solo podés cancelar tus propias solicitudes', 403);
  }
  return cambiarEstado(id, 'cancelada', usuarioId, 'cancelacion');
};

const devolver = (id, usuarioId) => {
  const solicitud = obtenerPorId(id);
  const result = cambiarEstado(id, 'devuelta', usuarioId, 'devolucion');
  db.get('equipos').find({ id: solicitud.equipoId }).assign({ estado: 'disponible' }).write();
  return result;
};

const resumen = () => {
  const hoy = new Date().toISOString().split('T')[0];
  const equipos = db.get('equipos').value();

  const disponiblesPorCategoria = equipos
    .filter((e) => e.estado === 'disponible')
    .reduce((acc, e) => {
      acc[e.categoria] = (acc[e.categoria] || 0) + 1;
      return acc;
    }, {});

  const pendientes = db.get('solicitudes').filter({ estado: 'pendiente' }).size().value();
  const prestados  = equipos.filter((e) => e.estado === 'prestado').length;
  const vencidas   = db.get('solicitudes').filter((s) => s.estado === 'aprobada' && s.fechaDevolucion < hoy).size().value();

  return { disponiblesPorCategoria, pendientes, prestados, vencidas };
};

module.exports = { listar, obtenerPorId, obtenerHistorial, crear, editar, aprobar, rechazar, cancelar, devolver, resumen };
