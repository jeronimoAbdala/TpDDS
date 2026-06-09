const authService = require('./auth.service');

const register = (req, res, next) => {
  try {
    const usuario = authService.register(req.body);
    res.status(201).json(usuario);
  } catch (err) {
    next(err);
  }
};

const login = (req, res, next) => {
  try {
    const result = authService.login(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login };
