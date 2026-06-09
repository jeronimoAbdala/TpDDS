const request = require('supertest');
const { createApp } = require('../src/app');
const { init, run } = require('../src/infrastructure/database/connection');

let app;
let tokenAdmin, tokenUsuario, tokenEncargado;

beforeAll(async () => {
  await init();
  app = createApp();

  const admin = await request(app).post('/api/auth/login').send({ email: 'admin@dds.com',  password: 'admin123' });
  const user  = await request(app).post('/api/auth/login').send({ email: 'ana@dds.com',    password: 'pass123'  });
  const enc   = await request(app).post('/api/auth/login').send({ email: 'carla@dds.com',  password: 'pass123'  });
  tokenAdmin     = admin.body.token;
  tokenUsuario   = user.body.token;
  tokenEncargado = enc.body.token;
});

afterAll(() => {
  run("DELETE FROM solicitudes WHERE motivo LIKE ?", ['%[test]%']);
});

// ─── Acceso sin token ──────────────────────────────────────────────────────────

describe('Protección JWT', () => {
  it('devuelve 401 sin token', async () => {
    const res = await request(app).get('/api/solicitudes');
    expect(res.status).toBe(401);
  });

  it('devuelve 403 si usuario intenta aprobar', async () => {
    const res = await request(app)
      .patch('/api/solicitudes/2/aprobar')
      .set('Authorization', `Bearer ${tokenUsuario}`);
    expect(res.status).toBe(403);
  });
});

// ─── Listado ───────────────────────────────────────────────────────────────────

describe('GET /api/solicitudes', () => {
  it('lista solicitudes sin filtros', async () => {
    const res = await request(app)
      .get('/api/solicitudes')
      .set('Authorization', `Bearer ${tokenAdmin}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('filtra por estado', async () => {
    const res = await request(app)
      .get('/api/solicitudes?estado=pendiente')
      .set('Authorization', `Bearer ${tokenAdmin}`);
    expect(res.status).toBe(200);
    res.body.forEach((s) => expect(s.estado).toBe('pendiente'));
  });
});

// ─── Detalle ───────────────────────────────────────────────────────────────────

describe('GET /api/solicitudes/:id', () => {
  it('retorna detalle de solicitud existente', async () => {
    const res = await request(app)
      .get('/api/solicitudes/1')
      .set('Authorization', `Bearer ${tokenAdmin}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', 1);
  });

  it('retorna 404 para solicitud inexistente', async () => {
    const res = await request(app)
      .get('/api/solicitudes/99999')
      .set('Authorization', `Bearer ${tokenAdmin}`);
    expect(res.status).toBe(404);
  });
});

// ─── Crear solicitud ───────────────────────────────────────────────────────────

describe('POST /api/solicitudes', () => {
  it('crea solicitud válida', async () => {
    const res = await request(app)
      .post('/api/solicitudes')
      .set('Authorization', `Bearer ${tokenUsuario}`)
      .send({ equipoId: 1, fechaRetiro: '2026-07-01', fechaDevolucion: '2026-07-03', motivo: 'Práctica [test]' });
    expect(res.status).toBe(201);
    expect(res.body.estado).toBe('pendiente');
  });

  it('rechaza fechas inconsistentes', async () => {
    const res = await request(app)
      .post('/api/solicitudes')
      .set('Authorization', `Bearer ${tokenUsuario}`)
      .send({ equipoId: 7, fechaRetiro: '2026-07-05', fechaDevolucion: '2026-07-03', motivo: 'Test [test]' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('rechaza equipo no disponible por superposición', async () => {
    // Solicitud 1 ya está aprobada para equipoId=1 en jun 10-12
    const res = await request(app)
      .post('/api/solicitudes')
      .set('Authorization', `Bearer ${tokenUsuario}`)
      .send({ equipoId: 1, fechaRetiro: '2026-06-10', fechaDevolucion: '2026-06-11', motivo: 'Superposición [test]' });
    expect(res.status).toBe(400);
  });
});

// ─── Transiciones de estado inválidas ─────────────────────────────────────────

describe('Transiciones de estado', () => {
  it('rechaza devolver una solicitud no aprobada', async () => {
    // solicitud 2 está pendiente
    const res = await request(app)
      .patch('/api/solicitudes/2/devolver')
      .set('Authorization', `Bearer ${tokenAdmin}`);
    expect(res.status).toBe(400);
  });

  it('rechaza aprobar una solicitud cancelada', async () => {
    // solicitud 10 está cancelada
    const res = await request(app)
      .patch('/api/solicitudes/10/aprobar')
      .set('Authorization', `Bearer ${tokenAdmin}`);
    expect(res.status).toBe(400);
  });
});
