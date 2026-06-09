const bcrypt = require('bcryptjs');
const Usuario = require('../../../entities/Usuario');
const AppError = require('../../../utils/AppError');

class RegisterUseCase {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  async execute({ nombre, email, password, rol = 'usuario' }) {
    const existe = await this.usuarioRepository.findByEmail(email);
    if (existe) throw new AppError('El email ya está registrado', 400);

    const usuario = new Usuario({
      id: null,
      nombre,
      email,
      passwordHash: bcrypt.hashSync(password, 10),
      rol,
      activo: true,
    });

    const guardado = await this.usuarioRepository.save(usuario);
    return guardado.toPublic();
  }
}

module.exports = RegisterUseCase;
