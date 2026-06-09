class ListarEquiposUseCase {
  constructor(equipoRepository) {
    this.equipoRepository = equipoRepository;
  }

  async execute(filters) {
    return this.equipoRepository.findAll(filters);
  }
}

module.exports = ListarEquiposUseCase;
