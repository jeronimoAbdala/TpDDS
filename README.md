# TP DDS 2026 — Control de Equipamiento

Sistema web para gestionar préstamos de equipamiento (notebooks, proyectores, cámaras, etc.).
Un usuario puede solicitar un equipo por un período determinado; un encargado o admin aprueba, rechaza o marca la devolución.
El sistema valida disponibilidad, evita superposiciones de fechas y lleva historial de cada cambio.

**Stack:** Node.js + Express (backend) · React + Vite (frontend) · lowdb JSON (persistencia) · JWT (auth) · Jest + Supertest (tests)

---

## Estado del proyecto

### Hecho

**Backend** (`/backend`)
- Servidor Express con estructura modular por recurso (`auth`, `equipos`, `solicitudes`)
- Persistencia con `lowdb` (archivo JSON, conserva datos al reiniciar)
- Autenticación JWT (`bcryptjs` + `jsonwebtoken`)
- Middlewares: `authenticate`, `requireRole`, `validate`, `errorHandler`
- Todas las rutas del enunciado implementadas
- Reglas de dominio en el servicio: validación de fechas, superposición, transiciones de estado, cambio automático del estado del equipo al aprobar/devolver
- Historial de cambios registrado en cada operación (creación, edición, aprobación, rechazo, cancelación, devolución)
- Vista resumen para admin/encargado: equipos disponibles por categoría, pendientes, prestados, vencidos
- Semilla de datos: 8 equipos, 4 usuarios (2 comunes + 1 encargado + 1 admin), 12 solicitudes en distintos estados con historial
- Tests con Jest + Supertest en `backend/tests/`

**Frontend** (`/frontend`)
- React + Vite configurado
- React Router con todas las rutas del enunciado
- `AuthContext` + `useAuth`: persiste usuario, token y rol en `localStorage`
- Rutas protegidas: `ProtectedRoute` (requiere login) y `AdminRoute` (requiere admin/encargado)
- Capa de servicios Axios separada por recurso (`auth`, `equipos`, `solicitudes`) con interceptor JWT automático
- Navbar con links condicionales por rol
- Todos los componentes creados: tabla, filtros, formulario, acciones por rol, historial, cards de resumen
- Todas las páginas creadas: Login/Registro, Listado, Detalle, Alta/Edición, Resumen, 404

---

### Pendiente

#### Alta prioridad (sin esto el TP no funciona end-to-end)

- [ ] **Conectar frontend al backend**: levantar ambos servidores y verificar que los servicios Axios llamen correctamente (ver sección *Cómo ejecutar*)
- [ ] **Tests de backend**: completar y ejecutar los tests en `backend/tests/`. Deben cubrir los 10 casos del enunciado (ver sección *Testing*)
- [ ] **README con usuarios de prueba**: completar la sección *Usuarios semilla* más abajo con las credenciales reales

#### Media prioridad (afecta calidad y nota)

- [ ] **Paginación en el frontend**: `SolicitudesPage` ya envía `page` y `limit` al backend, pero falta mostrar controles de navegación (botones Anterior / Siguiente) y el total de resultados
- [ ] **Validaciones en formularios**: `SolicitudForm` y `LoginPage` deben mostrar mensajes de error inline antes de enviar (frontend como capa de UX, backend como fuente de verdad)
- [ ] **Estados de carga en acciones**: `SolicitudActions` deshabilita botones durante la llamada, pero falta feedback visual (spinner o texto) en las acciones de aprobar/rechazar/devolver
- [ ] **Ruta `/` redirige a `/solicitudes`**: ya implementado, verificar que funcione correctamente con el guard de autenticación

#### Baja prioridad (pulido)

- [ ] Mostrar nombre del equipo en la tabla del listado (el backend ya lo devuelve en `equipoNombre`)
- [ ] Agregar filtro por `equipoId` en `SolicitudFilters` (campo de texto libre o select dinámico cargado desde `/api/equipos`)
- [ ] Mensaje de confirmación antes de aprobar/rechazar/devolver (ventana `confirm` o modal simple)
- [ ] Redirigir a `/login` automáticamente cuando el backend devuelve 401 (interceptor de respuesta en `services/axios.js`)

---

## Cómo ejecutar

### Backend

```bash
cd backend
npm install
npm run seed        # carga datos iniciales (solo la primera vez)
npm run dev         # servidor en http://localhost:3000
```

> Si querés resetear los datos: borrar `backend/src/db/database.json` y volver a correr `npm run seed`.

### Frontend

```bash
cd frontend
npm install         # ya debería estar hecho
npx vite            # o: npm run dev — servidor en http://localhost:5173
```

Ambos deben estar corriendo al mismo tiempo. El frontend apunta a `http://localhost:3000/api`.

### Tests

```bash
cd backend
npm test
```

---

## Usuarios semilla

| Nombre      | Email           | Contraseña | Rol       |
|-------------|-----------------|------------|-----------|
| Ana García  | ana@dds.com     | pass123    | usuario   |
| Bruno López | bruno@dds.com   | pass123    | usuario   |
| Carla Ruiz  | carla@dds.com   | pass123    | encargado |
| Admin DDS   | admin@dds.com   | admin123   | admin     |

> Las contraseñas están hasheadas con bcrypt en la base de datos. No se almacenan ni exponen en texto plano.

---

## Endpoints del backend

### Auth
| Método | Ruta                | Auth | Descripción              |
|--------|---------------------|------|--------------------------|
| POST   | /api/auth/register  | No   | Registrar nuevo usuario  |
| POST   | /api/auth/login     | No   | Login, devuelve JWT      |

### Equipos
| Método | Ruta          | Auth | Descripción       |
|--------|---------------|------|-------------------|
| GET    | /api/equipos  | Sí   | Listar equipos    |

### Solicitudes
| Método | Ruta                            | Auth          | Descripción                    |
|--------|---------------------------------|---------------|--------------------------------|
| GET    | /api/solicitudes                | Sí            | Listar con filtros y paginación |
| GET    | /api/solicitudes/resumen        | Admin/encarg. | Panel de administración        |
| GET    | /api/solicitudes/:id            | Sí            | Detalle de una solicitud       |
| GET    | /api/solicitudes/:id/historial  | Sí            | Historial de cambios           |
| POST   | /api/solicitudes                | Sí            | Crear solicitud                |
| PUT    | /api/solicitudes/:id            | Sí (dueño)    | Editar fechas/motivo           |
| PATCH  | /api/solicitudes/:id/cancelar   | Sí (dueño)    | Cancelar solicitud propia      |
| PATCH  | /api/solicitudes/:id/aprobar    | Admin/encarg. | Aprobar solicitud              |
| PATCH  | /api/solicitudes/:id/rechazar   | Admin/encarg. | Rechazar solicitud             |
| PATCH  | /api/solicitudes/:id/devolver   | Admin/encarg. | Marcar como devuelta           |

Filtros disponibles en `GET /api/solicitudes`:
```
?estado=pendiente&categoria=notebook&equipoId=1&desde=2026-06-01&hasta=2026-06-30&page=1&limit=10&sortBy=fechaRetiro&order=desc
```

---

## Rutas del frontend

| Ruta                       | Componente            | Acceso          |
|----------------------------|-----------------------|-----------------|
| /login                     | LoginPage             | Público         |
| /solicitudes               | SolicitudesPage       | Autenticado     |
| /solicitudes/nueva         | SolicitudFormPage     | Autenticado     |
| /solicitudes/:id           | SolicitudDetallePage  | Autenticado     |
| /solicitudes/:id/editar    | SolicitudFormPage     | Autenticado     |
| /resumen                   | ResumenPage           | Admin/encargado |
| *                          | NotFoundPage          | Todos           |

---

## Reglas de dominio

**Disponibilidad de un equipo**: el equipo debe tener `estado = disponible` Y no tener otra solicitud `aprobada` con fechas superpuestas al período solicitado.

**Autorización**: un usuario con rol `usuario` puede crear solicitudes de equipos que requieran autorización, pero solo `admin` o `encargado` pueden aprobarlas.

**Transiciones de estado válidas**:
```
pendiente  →  aprobada | rechazada | cancelada
aprobada   →  cancelada | devuelta
```
Cualquier otra transición devuelve 400.

**Cambio de estado del equipo**: al aprobar una solicitud el equipo pasa a `prestado`; al marcar devolución vuelve a `disponible`.

**Préstamos vencidos**: solicitudes con `estado = aprobada` y `fechaDevolucion < hoy`.

---

## JWT y permisos

El token se genera al hacer login y tiene payload `{ id, nombre, email, rol }` (sin contraseña). Se envía en cada request como header `Authorization: Bearer <token>`. El frontend lo persiste en `localStorage` y lo adjunta automáticamente vía interceptor de Axios.

Respuestas de error de autorización:
- `401 Unauthorized`: no se envió token o el token es inválido/expirado
- `403 Forbidden`: token válido pero el rol no tiene permiso para esa acción

---

## Testing mínimo requerido (enunciado)

Los tests en `backend/tests/` deben cubrir:

1. Login correcto e inválido
2. Listado de solicitudes con y sin filtros
3. Detalle de solicitud existente e inexistente
4. Creación válida de una solicitud
5. Creación inválida por fechas inconsistentes (`fechaRetiro >= fechaDevolucion`)
6. Creación inválida por equipo no disponible o superposición
7. Acceso sin JWT a una ruta protegida (esperar 401)
8. Acceso con JWT de `usuario` a una acción de admin/encargado (esperar 403)
9. Devolución inválida de una solicitud no aprobada
10. Transición de estado no permitida (ej: aprobar una solicitud cancelada)

---

## Estructura del proyecto

```
TP_DDS/
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   ├── config/database.js          # instancia lowdb
│   │   ├── db/
│   │   │   ├── schema.js               # estructura inicial del JSON
│   │   │   ├── seed.js                 # datos de prueba
│   │   │   └── database.json           # persistencia (no commitear)
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js       # verifica JWT
│   │   │   ├── authorize.middleware.js  # verifica rol
│   │   │   ├── validate.middleware.js   # valida campos requeridos
│   │   │   └── error.middleware.js      # manejo centralizado de errores
│   │   ├── modules/
│   │   │   ├── auth/                   # register, login
│   │   │   ├── equipos/                # listado
│   │   │   └── solicitudes/            # dominio principal
│   │   └── utils/
│   │       ├── AppError.js             # error con statusCode
│   │       └── nextId.js               # autoincremento por colección
│   └── tests/
│       ├── auth.test.js
│       └── solicitudes.test.js
└── frontend/
    ├── src/
    │   ├── contexts/AuthContext.jsx     # user, token, rol, login(), logout()
    │   ├── hooks/useAuth.js
    │   ├── services/                   # Axios por recurso
    │   ├── components/
    │   │   ├── common/                 # ProtectedRoute, AdminRoute, Navbar, etc.
    │   │   ├── solicitudes/            # Table, Filters, Form, Actions, Historial
    │   │   └── resumen/                # ResumenCard
    │   └── pages/                      # una por ruta
    └── vite.config.js
```

---

## Limitaciones conocidas

- La persistencia con `lowdb` es suficiente para desarrollo y pruebas, pero no es apta para producción concurrente.
- El frontend no implementa paginación visible todavía (envía los params, falta el UI de navegación).
- No hay manejo automático de expiración de token en el frontend: si el token expira, el usuario verá errores 401 hasta que cierre sesión manualmente.
