require('dotenv').config();

const run = async () => {
  const bcrypt = require('bcryptjs');
  const { init, run: dbRun, get } = require('../infrastructure/database/connection');

  await init();

  const yaHayDatos = get('SELECT COUNT(*) AS c FROM usuarios').c > 0;
  if (yaHayDatos) { console.log('Seed ya ejecutado, saltando...'); return; }

  const hash = (pw) => bcrypt.hashSync(pw, 10);
  const now  = new Date().toISOString();

  // ── Usuarios ──────────────────────────────────────────────────────────────
  dbRun('INSERT INTO usuarios (nombre, email, passwordHash, rol, activo) VALUES (?, ?, ?, ?, ?)', ['Ana García',  'ana@dds.com',   hash('pass123'),  'usuario',   1]);
  dbRun('INSERT INTO usuarios (nombre, email, passwordHash, rol, activo) VALUES (?, ?, ?, ?, ?)', ['Bruno López', 'bruno@dds.com', hash('pass123'),  'usuario',   1]);
  dbRun('INSERT INTO usuarios (nombre, email, passwordHash, rol, activo) VALUES (?, ?, ?, ?, ?)', ['Carla Ruiz',  'carla@dds.com', hash('pass123'),  'encargado', 1]);
  dbRun('INSERT INTO usuarios (nombre, email, passwordHash, rol, activo) VALUES (?, ?, ?, ?, ?)', ['Admin DDS',   'admin@dds.com', hash('admin123'), 'admin',     1]);

  // ── Equipos ───────────────────────────────────────────────────────────────
  dbRun('INSERT INTO equipos (codigoInventario, nombre, categoria, estado, ubicacion, requiereAutorizacion) VALUES (?, ?, ?, ?, ?, ?)', ['INV-2026-001', 'Notebook Dell 14',      'notebook',   'disponible',    'Lab A5',    0]);
  dbRun('INSERT INTO equipos (codigoInventario, nombre, categoria, estado, ubicacion, requiereAutorizacion) VALUES (?, ?, ?, ?, ?, ?)', ['INV-2026-002', 'Notebook HP ProBook',   'notebook',   'disponible',    'Lab A5',    0]);
  dbRun('INSERT INTO equipos (codigoInventario, nombre, categoria, estado, ubicacion, requiereAutorizacion) VALUES (?, ?, ?, ?, ?, ?)', ['INV-2026-003', 'Proyector Epson X41',   'proyector',  'disponible',    'Aula 302',  1]);
  dbRun('INSERT INTO equipos (codigoInventario, nombre, categoria, estado, ubicacion, requiereAutorizacion) VALUES (?, ?, ?, ?, ?, ?)', ['INV-2026-004', 'Proyector BenQ MS550',  'proyector',  'prestado',      'Depósito',  1]);
  dbRun('INSERT INTO equipos (codigoInventario, nombre, categoria, estado, ubicacion, requiereAutorizacion) VALUES (?, ?, ?, ?, ?, ?)', ['INV-2026-005', 'Cámara Canon EOS M50',  'cámara',     'disponible',    'Depósito',  1]);
  dbRun('INSERT INTO equipos (codigoInventario, nombre, categoria, estado, ubicacion, requiereAutorizacion) VALUES (?, ?, ?, ?, ?, ?)', ['INV-2026-006', 'Kit de Red Cisco',      'kit de red', 'mantenimiento', 'Lab Redes', 1]);
  dbRun('INSERT INTO equipos (codigoInventario, nombre, categoria, estado, ubicacion, requiereAutorizacion) VALUES (?, ?, ?, ?, ?, ?)', ['INV-2026-007', 'Tablet Samsung Tab S8', 'tablet',     'disponible',    'Lab A5',    0]);
  dbRun('INSERT INTO equipos (codigoInventario, nombre, categoria, estado, ubicacion, requiereAutorizacion) VALUES (?, ?, ?, ?, ?, ?)', ['INV-2026-008', 'Micrófono Blue Yeti',   'audio',      'disponible',    'Depósito',  0]);

  // ── Solicitudes ───────────────────────────────────────────────────────────
  const sols = [
    [1, 1, '2026-06-10', '2026-06-12', 'Práctica de laboratorio',   'aprobada',  3],
    [2, 2, '2026-06-10', '2026-06-11', 'Trabajo de integración',    'pendiente', null],
    [3, 1, '2026-06-15', '2026-06-16', 'Presentación grupal',       'pendiente', null],
    [4, 2, '2026-06-05', '2026-06-07', 'Exposición proyecto final', 'aprobada',  4],
    [5, 1, '2026-06-01', '2026-06-03', 'Documentación de proceso',  'devuelta',  3],
    [7, 2, '2026-06-20', '2026-06-22', 'Demo cliente',              'pendiente', null],
    [8, 1, '2026-06-18', '2026-06-19', 'Grabación de podcast',      'aprobada',  3],
    [1, 2, '2026-06-25', '2026-06-27', 'Clase invertida',           'pendiente', null],
    [2, 1, '2026-05-20', '2026-05-22', 'Hackathon interno',         'rechazada', null],
    [3, 2, '2026-05-10', '2026-05-12', 'Workshop de diseño',        'cancelada', null],
    [7, 1, '2026-06-02', '2026-06-04', 'Evaluación presencial',     'devuelta',  4],
    [8, 2, '2026-06-08', '2026-06-09', 'Entrevista técnica',        'aprobada',  3],
  ];
  sols.forEach(([eqId, uId, fR, fD, mot, est, auth]) => {
    dbRun('INSERT INTO solicitudes (equipoId, usuarioId, fechaRetiro, fechaDevolucion, motivo, estado, autorizadoPor) VALUES (?, ?, ?, ?, ?, ?, ?)', [eqId, uId, fR, fD, mot, est, auth]);
  });

  // ── Historial básico ──────────────────────────────────────────────────────
  const hist = [
    [1, 1, 'creacion',    now, null,                              '{"estado":"pendiente"}'],
    [1, 3, 'aprobacion',  now, '{"estado":"pendiente"}',          '{"estado":"aprobada"}' ],
    [4, 2, 'creacion',    now, null,                              '{"estado":"pendiente"}'],
    [4, 4, 'aprobacion',  now, '{"estado":"pendiente"}',          '{"estado":"aprobada"}' ],
    [5, 1, 'creacion',    now, null,                              '{"estado":"pendiente"}'],
    [5, 3, 'aprobacion',  now, '{"estado":"pendiente"}',          '{"estado":"aprobada"}' ],
    [5, 1, 'devolucion',  now, '{"estado":"aprobada"}',           '{"estado":"devuelta"}' ],
    [9, 1, 'creacion',    now, null,                              '{"estado":"pendiente"}'],
    [9, 3, 'rechazo',     now, '{"estado":"pendiente"}',          '{"estado":"rechazada"}'],
    [10,2, 'creacion',    now, null,                              '{"estado":"pendiente"}'],
    [10,2, 'cancelacion', now, '{"estado":"pendiente"}',          '{"estado":"cancelada"}'],
  ];
  hist.forEach(([sId, uId, accion, fh, va, vn]) => {
    dbRun('INSERT INTO historial_solicitudes (solicitudId, usuarioId, accion, fechaHora, valorAnterior, valorNuevo) VALUES (?, ?, ?, ?, ?, ?)', [sId, uId, accion, fh, va, vn]);
  });

  console.log('Seed completado.');
};

run().catch(console.error);
