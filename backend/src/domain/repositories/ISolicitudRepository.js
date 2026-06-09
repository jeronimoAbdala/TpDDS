class ISolicitudRepository {
  async findAll(filters)                      { throw new Error('Not implemented') }
  async findById(id)                          { throw new Error('Not implemented') }
  async save(solicitud)                       { throw new Error('Not implemented') }
  async update(id, campos)                    { throw new Error('Not implemented') }
  async tieneSuperposicion(equipoId, fechaRetiro, fechaDevolucion, excluirId) { throw new Error('Not implemented') }
  async contarPorEstado(estado)               { throw new Error('Not implemented') }
  async contarVencidas(hoy)                   { throw new Error('Not implemented') }
}

module.exports = ISolicitudRepository;
