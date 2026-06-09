CREATE TABLE IF NOT EXISTS usuarios (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre        TEXT    NOT NULL,
  email         TEXT    NOT NULL UNIQUE,
  passwordHash  TEXT    NOT NULL,
  rol           TEXT    NOT NULL CHECK(rol IN ('usuario', 'encargado', 'admin')),
  activo        INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS equipos (
  id                    INTEGER PRIMARY KEY AUTOINCREMENT,
  codigoInventario      TEXT    NOT NULL UNIQUE,
  nombre                TEXT    NOT NULL,
  categoria             TEXT    NOT NULL,
  estado                TEXT    NOT NULL DEFAULT 'disponible'
                          CHECK(estado IN ('disponible', 'prestado', 'mantenimiento', 'baja')),
  ubicacion             TEXT    NOT NULL,
  requiereAutorizacion  INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS solicitudes (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  equipoId         INTEGER NOT NULL REFERENCES equipos(id),
  usuarioId        INTEGER NOT NULL REFERENCES usuarios(id),
  fechaRetiro      TEXT    NOT NULL,
  fechaDevolucion  TEXT    NOT NULL,
  motivo           TEXT    NOT NULL,
  estado           TEXT    NOT NULL DEFAULT 'pendiente'
                     CHECK(estado IN ('pendiente', 'aprobada', 'rechazada', 'cancelada', 'devuelta')),
  autorizadoPor    INTEGER REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS historial_solicitudes (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  solicitudId     INTEGER NOT NULL REFERENCES solicitudes(id),
  usuarioId       INTEGER NOT NULL REFERENCES usuarios(id),
  accion          TEXT    NOT NULL
                    CHECK(accion IN ('creacion', 'edicion', 'aprobacion', 'rechazo', 'cancelacion', 'devolucion')),
  fechaHora       TEXT    NOT NULL,
  valorAnterior   TEXT,
  valorNuevo      TEXT
);
