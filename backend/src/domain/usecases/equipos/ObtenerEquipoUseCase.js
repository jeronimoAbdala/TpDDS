const AppError = require('../../../utils/AppError');

class ObtenerEquipoUseCase {
  constructor(equipoRepository) {
    this.equipoRepository = equipoRepository;
  }

  async execute(id) {
    const equipo = await this.equipoRepository.findById(id);
    if (!equipo) throw new AppError('Equipo no encontrado', 404);
    return equipo;
  }
}

module.exports = ObtenerEquipoUseCase;
