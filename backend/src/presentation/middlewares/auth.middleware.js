const jwt = require('jsonwebtoken');
const AppError = require('../../utils/AppError');
const Usuario = require('../../entities/Usuario');

const authenticate = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return next(new AppError('Token requerido', 401));

  const token = header.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = new Usuario({ ...payload, passwordHash: '', activo: true });
    next();
  } catch {
    next(new AppError('Token inválido o expirado', 401));
  }
};

module.exports = { authenticate };
