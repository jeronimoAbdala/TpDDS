const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/database');

beforeAll(() => {
  db.get('usuarios').remove((u) => u.email.endsWith('@test.com')).write();
});

afterAll(() => {
  db.get('usuarios').remove((u) => u.email.endsWith('@test.com')).write();
});

describe('POST /api/auth/register', () => {
  it('registra un usuario nuevo', async () => {
    const res = await request(app).post('/api/auth/register').send({
      nombre: 'Test User', email: 'nuevo@test.com', password: 'pass123',
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.email).toBe('nuevo@test.com');
  });

  it('rechaza registro con datos faltantes', async () => {
    const res = await request(app).post('/api/auth/register').send({ email: 'x@test.com' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});

describe('POST /api/auth/login', () => {
  it('inicia sesión y devuelve token', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'admin@dds.com', password: 'admin123',
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.usuario.rol).toBe('admin');
  });

  it('rechaza credenciales inválidas', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'admin@dds.com', password: 'incorrecta',
    });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error');
  });
});
