class IEquipoRepository {
  async findAll(filters)          { throw new Error('Not implemented') }
  async findById(id)              { throw new Error('Not implemented') }
  async updateEstado(id, estado)  { throw new Error('Not implemented') }
}

module.exports = IEquipoRepository;
