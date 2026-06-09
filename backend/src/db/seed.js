require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('../config/database');

const seed = () => {
  if (db.get('usuarios').size().value() > 0) {
    console.log('Seed ya ejecutado, saltando...');
    return;
  }

  const hash = (pw) => bcrypt.hashSync(pw, 10);
  const now = new Date().toISOString();

  // ── Usuarios ──────────────────────────────────────────────────────────────
  const usuarios = [
    { id: 1, nombre: 'Ana García',  email: 'ana@dds.com',   passwordHash: hash('pass123'),  rol: 'usuario',   activo: true },
    { id: 2, nombre: 'Bruno López', email: 'bruno@dds.com', passwordHash: hash('pass123'),  rol: 'usuario',   activo: true },
    { id: 3, nombre: 'Carla Ruiz',  email: 'carla@dds.com', passwordHash: hash('pass123'),  rol: 'encargado', activo: true },
    { id: 4, nombre: 'Admin DDS',   email: 'admin@dds.com', passwordHash: hash('admin123'), rol: 'admin',     activo: true },
  ];

  // ── Equipos ───────────────────────────────────────────────────────────────
  const equipos = [
    { id: 1, codigoInventario: 'INV-2026-001', nombre: 'Notebook Dell 14',      categoria: 'notebook',   estado: 'disponible',    ubicacion: 'Lab A5',     requiereAutorizacion: false },
    { id: 2, codigoInventario: 'INV-2026-002', nombre: 'Notebook HP ProBook',   categoria: 'notebook',   estado: 'disponible',    ubicacion: 'Lab A5',     requiereAutorizacion: false },
    { id: 3, codigoInventario: 'INV-2026-003', nombre: 'Proyector Epson X41',   categoria: 'proyector',  estado: 'disponible',    ubicacion: 'Aula 302',   requiereAutorizacion: true  },
    { id: 4, codigoInventario: 'INV-2026-004', nombre: 'Proyector BenQ MS550',  categoria: 'proyector',  estado: 'prestado',      ubicacion: 'Depósito',   requiereAutorizacion: true  },
    { id: 5, codigoInventario: 'INV-2026-005', nombre: 'Cámara Canon EOS M50',  categoria: 'cámara',     estado: 'disponible',    ubicacion: 'Depósito',   requiereAutorizacion: true  },
    { id: 6, codigoInventario: 'INV-2026-006', nombre: 'Kit de Red Cisco',      categoria: 'kit de red', estado: 'mantenimiento', ubicacion: 'Lab Redes',  requiereAutorizacion: true  },
    { id: 7, codigoInventario: 'INV-2026-007', nombre: 'Tablet Samsung Tab S8', categoria: 'tablet',     estado: 'disponible',    ubicacion: 'Lab A5',     requiereAutorizacion: false },
    { id: 8, codigoInventario: 'INV-2026-008', nombre: 'Micrófono Blue Yeti',   categoria: 'audio',      estado: 'disponible',    ubicacion: 'Depósito',   requiereAutorizacion: false },
  ];

  // ── Solicitudes ───────────────────────────────────────────────────────────
  const solicitudes = [
    { id: 1,  equipoId: 1, usuarioId: 1, fechaRetiro: '2026-06-10', fechaDevolucion: '2026-06-12', motivo: 'Práctica de laboratorio',   estado: 'aprobada',  autorizadoPor: 3 },
    { id: 2,  equipoId: 2, usuarioId: 2, fechaRetiro: '2026-06-10', fechaDevolucion: '2026-06-11', motivo: 'Trabajo de integración',    estado: 'pendiente', autorizadoPor: null },
    { id: 3,  equipoId: 3, usuarioId: 1, fechaRetiro: '2026-06-15', fechaDevolucion: '2026-06-16', motivo: 'Presentación grupal',       estado: 'pendiente', autorizadoPor: null },
    { id: 4,  equipoId: 4, usuarioId: 2, fechaRetiro: '2026-06-05', fechaDevolucion: '2026-06-07', motivo: 'Exposición proyecto final', estado: 'aprobada',  autorizadoPor: 4 },
    { id: 5,  equipoId: 5, usuarioId: 1, fechaRetiro: '2026-06-01', fechaDevolucion: '2026-06-03', motivo: 'Documentación de proceso',  estado: 'devuelta',  autorizadoPor: 3 },
    { id: 6,  equipoId: 7, usuarioId: 2, fechaRetiro: '2026-06-20', fechaDevolucion: '2026-06-22', motivo: 'Demo cliente',              estado: 'pendiente', autorizadoPor: null },
    { id: 7,  equipoId: 8, usuarioId: 1, fechaRetiro: '2026-06-18', fechaDevolucion: '2026-06-19', motivo: 'Grabación de podcast',      estado: 'aprobada',  autorizadoPor: 3 },
    { id: 8,  equipoId: 1, usuarioId: 2, fechaRetiro: '2026-06-25', fechaDevolucion: '2026-06-27', motivo: 'Clase invertida',           estado: 'pendiente', autorizadoPor: null },
    { id: 9,  equipoId: 2, usuarioId: 1, fechaRetiro: '2026-05-20', fechaDevolucion: '2026-05-22', motivo: 'Hackathon interno',         estado: 'rechazada', autorizadoPor: null },
    { id: 10, equipoId: 3, usuarioId: 2, fechaRetiro: '2026-05-10', fechaDevolucion: '2026-05-12', motivo: 'Workshop de diseño',        estado: 'cancelada', autorizadoPor: null },
    { id: 11, equipoId: 7, usuarioId: 1, fechaRetiro: '2026-06-02', fechaDevolucion: '2026-06-04', motivo: 'Evaluación presencial',     estado: 'devuelta',  autorizadoPor: 4 },
    { id: 12, equipoId: 8, usuarioId: 2, fechaRetiro: '2026-06-08', fechaDevolucion: '2026-06-09', motivo: 'Entrevista técnica',        estado: 'aprobada',  autorizadoPor: 3 },
  ];

  // ── Historial ─────────────────────────────────────────────────────────────
  const historial = [
    { id: 1,  solicitudId: 1,  usuarioId: 1, accion: 'creacion',    fechaHora: now, valorAnterior: null,                          valorNuevo: JSON.stringify({ estado: 'pendiente' }) },
    { id: 2,  solicitudId: 1,  usuarioId: 3, accion: 'aprobacion',  fechaHora: now, valorAnterior: JSON.stringify({ estado: 'pendiente' }), valorNuevo: JSON.stringify({ estado: 'aprobada' }) },
    { id: 3,  solicitudId: 4,  usuarioId: 2, accion: 'creacion',    fechaHora: now, valorAnterior: null,                          valorNuevo: JSON.stringify({ estado: 'pendiente' }) },
    { id: 4,  solicitudId: 4,  usuarioId: 4, accion: 'aprobacion',  fechaHora: now, valorAnterior: JSON.stringify({ estado: 'pendiente' }), valorNuevo: JSON.stringify({ estado: 'aprobada' }) },
    { id: 5,  solicitudId: 5,  usuarioId: 1, accion: 'creacion',    fechaHora: now, valorAnterior: null,                          valorNuevo: JSON.stringify({ estado: 'pendiente' }) },
    { id: 6,  solicitudId: 5,  usuarioId: 3, accion: 'aprobacion',  fechaHora: now, valorAnterior: JSON.stringify({ estado: 'pendiente' }), valorNuevo: JSON.stringify({ estado: 'aprobada' }) },
    { id: 7,  solicitudId: 5,  usuarioId: 1, accion: 'devolucion',  fechaHora: now, valorAnterior: JSON.stringify({ estado: 'aprobada'  }), valorNuevo: JSON.stringify({ estado: 'devuelta' }) },
    { id: 8,  solicitudId: 9,  usuarioId: 1, accion: 'creacion',    fechaHora: now, valorAnterior: null,                          valorNuevo: JSON.stringify({ estado: 'pendiente' }) },
    { id: 9,  solicitudId: 9,  usuarioId: 3, accion: 'rechazo',     fechaHora: now, valorAnterior: JSON.stringify({ estado: 'pendiente' }), valorNuevo: JSON.stringify({ estado: 'rechazada' }) },
    { id: 10, solicitudId: 10, usuarioId: 2, accion: 'creacion',    fechaHora: now, valorAnterior: null,                          valorNuevo: JSON.stringify({ estado: 'pendiente' }) },
    { id: 11, solicitudId: 10, usuarioId: 2, accion: 'cancelacion', fechaHora: now, valorAnterior: JSON.stringify({ estado: 'pendiente' }), valorNuevo: JSON.stringify({ estado: 'cancelada' }) },
  ];

  db.set('usuarios',              usuarios).write();
  db.set('equipos',               equipos).write();
  db.set('solicitudes',           solicitudes).write();
  db.set('historial_solicitudes', historial).write();

  console.log('Seed completado.');
};

seed();
