const { usuarioRepository } = require('../../infrastructure/container');
const RegisterUseCase = require('../../domain/usecases/auth/RegisterUseCase');
const LoginUseCase    = require('../../domain/usecases/auth/LoginUseCase');

const register = async (req, res, next) => {
  try {
    const resultado = await new RegisterUseCase(usuarioRepository).execute(req.body);
    res.status(201).json(resultado);
  } catch (err) { next(err); }
};

const login = async (req, res, next) => {
  try {
    const resultado = await new LoginUseCase(usuarioRepository).execute(req.body);
    res.json(resultado);
  } catch (err) { next(err); }
};

module.exports = { register, login };
