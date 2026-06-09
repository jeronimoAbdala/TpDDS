# TP DDS 2026 — Control de Equipamiento

Este proyecto es un sistema para gestionar préstamos de equipamiento institucional: notebooks, proyectores, cámaras, kits de red, etc.

La idea es simple: un usuario pide prestado un equipo por un período determinado, y un encargado o administrador decide si aprueba o rechaza la solicitud. El sistema se encarga de verificar que el equipo esté disponible, que las fechas no se superpongan con otro préstamo ya aprobado, y registra un historial de cada cambio que se haga.

**Stack:** Node.js + Express · React + Vite · lowdb (JSON) · JWT · Jest + Supertest

---

## Cómo levantar el proyecto

Necesitás dos terminales abiertas, una para cada parte.

**Backend** (puerto 3001):
```bash
cd backend
npm install
node src/db/seed.js   # solo la primera vez, carga los datos de prueba
npm run dev
```

**Frontend** (puerto 5173):
```bash
cd frontend
npm install
npm run dev
```

Para correr los tests:
```bash
cd backend
npm test
```

> Si querés resetear la base de datos: borrá `backend/src/db/database.json` y volvé a correr `node src/db/seed.js`.

---

## Usuarios de prueba

| Email | Contraseña | Rol |
|---|---|---|
| ana@dds.com | pass123 | usuario |
| bruno@dds.com | pass123 | usuario |
| carla@dds.com | pass123 | encargado |
| admin@dds.com | admin123 | admin |

Las contraseñas se guardan hasheadas con bcrypt, nunca en texto plano.

---

## Roles y permisos

El sistema tiene tres roles con distintas capacidades:

- **usuario**: puede crear solicitudes, ver las suyas y cancelarlas mientras no estén devueltas.
- **encargado**: puede ver todas las solicitudes, aprobar, rechazar y registrar devoluciones.
- **admin**: igual que encargado, más acceso al panel de resumen.

Cuando un equipo tiene `requiereAutorizacion = true`, solo encargado o admin pueden aprobarlo (aunque cualquier usuario puede pedirlo).

El backend protege todas las rutas con JWT. Si no mandás token recibís `401`; si tu rol no tiene permiso, `403`.

---

## Reglas de negocio

Una solicitud solo se puede aprobar si:
- el equipo existe y está en estado `disponible`
- no hay otra solicitud `aprobada` con fechas que se superpongan

Los estados siguen este flujo y no se puede saltar pasos:
```
pendiente  →  aprobada | rechazada | cancelada
aprobada   →  cancelada | devuelta
```

Cuando se aprueba una solicitud, el equipo pasa automáticamente a `prestado`. Cuando se registra la devolución, vuelve a `disponible`.

---

## Estructura del proyecto

```
TP_DDS/
├── backend/
│   ├── src/
│   │   ├── app.js                        # punto de entrada, monta rutas y middlewares
│   │   ├── config/database.js            # conexión a la base de datos (lowdb)
│   │   ├── db/
│   │   │   ├── seed.js                   # datos iniciales de prueba
│   │   │   └── database.json             # archivo de persistencia (no subir al repo)
│   │   ├── middlewares/                  # auth JWT, autorización por rol, validación, errores
│   │   ├── modules/
│   │   │   ├── auth/                     # registro y login
│   │   │   ├── equipos/                  # listado de equipos
│   │   │   └── solicitudes/              # toda la lógica del dominio
│   │   └── utils/
│   │       ├── AppError.js               # clase de error con código HTTP
│   │       └── nextId.js                 # genera IDs autoincrement para lowdb
│   └── tests/
│       ├── auth.test.js
│       └── solicitudes.test.js
└── frontend/
    └── src/
        ├── contexts/AuthContext.jsx      # guarda usuario, token y rol en memoria y localStorage
        ├── services/                     # llamadas a la API separadas por recurso (Axios)
        ├── components/                   # tabla, filtros, formulario, acciones, historial
        └── pages/                        # una página por ruta
```

Cada módulo del backend sigue la misma estructura: `routes → controller → service`. La lógica de negocio vive únicamente en el service; el controller solo traduce entre HTTP y el service.

---

## Endpoints disponibles

| Método | Ruta | Requiere |
|---|---|---|
| POST | /api/auth/register | — |
| POST | /api/auth/login | — |
| GET | /api/equipos | login |
| GET | /api/solicitudes | login |
| GET | /api/solicitudes/resumen | admin o encargado |
| GET | /api/solicitudes/:id | login |
| GET | /api/solicitudes/:id/historial | login |
| POST | /api/solicitudes | login |
| PUT | /api/solicitudes/:id | login (dueño) |
| PATCH | /api/solicitudes/:id/cancelar | login (dueño) |
| PATCH | /api/solicitudes/:id/aprobar | admin o encargado |
| PATCH | /api/solicitudes/:id/rechazar | admin o encargado |
| PATCH | /api/solicitudes/:id/devolver | admin o encargado |

El listado de solicitudes acepta filtros: `?estado=pendiente&categoria=notebook&desde=2026-06-01&hasta=2026-06-30&page=1&limit=10&sortBy=fechaRetiro&order=desc`

---

## Limitaciones conocidas

- `lowdb` guarda todo en un archivo JSON. Es suficiente para desarrollo y para el TP, pero no escalaría en producción con muchos usuarios simultáneos.
- Si el token JWT expira (dura 8 horas), el usuario va a ver errores 401 hasta que cierre sesión y vuelva a entrar.
