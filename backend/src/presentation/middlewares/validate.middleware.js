const AppError = require('../../utils/AppError');

const validate = (validatorFn) => (req, res, next) => {
  const error = validatorFn(req);
  if (error) return next(new AppError(error, 400));
  next();
};

module.exports = { validate };
