const AppError = require('../../utils/AppError');

const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.rol)) return next(new AppError('No tenés permiso para realizar esta acción', 403));
  next();
};

module.exports = { requireRole };
