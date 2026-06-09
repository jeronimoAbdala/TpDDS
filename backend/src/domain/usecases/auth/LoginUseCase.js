const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AppError = require('../../../utils/AppError');

class LoginUseCase {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  async execute({ email, password }) {
    const usuario = await this.usuarioRepository.findByEmail(email);
    if (!usuario || !usuario.activo) throw new AppError('Credenciales inválidas', 401);
    if (!bcrypt.compareSync(password, usuario.passwordHash)) throw new AppError('Credenciales inválidas', 401);

    const token = jwt.sign(
      { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    return { token, usuario: usuario.toPublic() };
  }
}

module.exports = LoginUseCase;
