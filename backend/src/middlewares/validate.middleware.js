const AppError = require('../utils/AppError');

// Recibe una función validadora (req) => string | null
// Si retorna un mensaje, responde 400. Si retorna null, pasa al siguiente.
const validate = (validatorFn) => (req, res, next) => {
  const error = validatorFn(req);
  if (error) return next(new AppError(error, 400));
  next();
};

module.exports = { validate };
