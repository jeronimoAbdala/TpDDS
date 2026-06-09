const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../../config/database');
const nextId = require('../../utils/nextId');
const AppError = require('../../utils/AppError');

const register = ({ nombre, email, password, rol = 'usuario' }) => {
  const existe = db.get('usuarios').find({ email }).value();
  if (existe) throw new AppError('El email ya está registrado', 400);

  const nuevo = {
    id: nextId('usuarios'),
    nombre,
    email,
    passwordHash: bcrypt.hashSync(password, 10),
    rol,
    activo: true,
  };
  db.get('usuarios').push(nuevo).write();

  const { passwordHash, ...publico } = nuevo;
  return publico;
};

const login = ({ email, password }) => {
  const usuario = db.get('usuarios').find({ email, activo: true }).value();
  if (!usuario || !bcrypt.compareSync(password, usuario.passwordHash)) {
    throw new AppError('Credenciales inválidas', 401);
  }

  const token = jwt.sign(
    { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  return {
    token,
    usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
  };
};

module.exports = { register, login };
