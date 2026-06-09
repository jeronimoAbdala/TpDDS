class ResumenUseCase {
  constructor(solicitudRepository, equipoRepository) {
    this.solicitudRepository = solicitudRepository;
    this.equipoRepository    = equipoRepository;
  }

  async execute() {
    const hoy = new Date().toISOString().split('T')[0];

    const [equipos, pendientes, vencidas] = await Promise.all([
      this.equipoRepository.findAll({}),
      this.solicitudRepository.contarPorEstado('pendiente'),
      this.solicitudRepository.contarVencidas(hoy),
    ]);

    const disponiblesPorCategoria = equipos
      .filter((e) => e.estaDisponible())
      .reduce((acc, e) => { acc[e.categoria] = (acc[e.categoria] || 0) + 1; return acc; }, {});

    const prestados = equipos.filter((e) => e.estado === 'prestado').length;

    return { disponiblesPorCategoria, pendientes, prestados, vencidas };
  }
}

module.exports = ResumenUseCase;
