class ListarSolicitudesUseCase {
  constructor(solicitudRepository) {
    this.solicitudRepository = solicitudRepository;
  }

  async execute(filters) {
    return this.solicitudRepository.findAll(filters);
  }
}

module.exports = ListarSolicitudesUseCase;
