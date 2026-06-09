// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Error interno del servidor';
  res.status(status).json({ error: message });
};

module.exports = { errorHandler };
