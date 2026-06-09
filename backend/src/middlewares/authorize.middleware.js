const AppError = require('../utils/AppError');

// Verifica que el usuario autenticado tenga alguno de los roles indicados
const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.rol)) {
    return next(new AppError('No tenés permiso para realizar esta acción', 403));
  }
  next();
};

// Verifica que el usuario sea el dueño del recurso O tenga rol privilegiado
const requireOwnerOrRole = (getOwnerId, ...roles) => async (req, res, next) => {
  try {
    const ownerId = await getOwnerId(req);
    const isOwner = req.user.id === ownerId;
    const hasRole = roles.includes(req.user.rol);
    if (!isOwner && !hasRole) {
      return next(new AppError('No tenés permiso para realizar esta acción', 403));
    }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { requireRole, requireOwnerOrRole };
