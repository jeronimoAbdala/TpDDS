const { Router } = require('express');
const { validate } = require('../middlewares/validate.middleware');
const controller = require('../controllers/auth.controller');

const router = Router();

const validateRegister = ({ body: { nombre, email, password } }) => {
  if (!nombre || !email || !password) return 'nombre, email y password son requeridos';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Email inválido';
  if (password.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
  return null;
};

const validateLogin = ({ body: { email, password } }) => {
  if (!email || !password) return 'email y password son requeridos';
  return null;
};

router.post('/register', validate(validateRegister), controller.register);
router.post('/login',    validate(validateLogin),    controller.login);

module.exports = router;
