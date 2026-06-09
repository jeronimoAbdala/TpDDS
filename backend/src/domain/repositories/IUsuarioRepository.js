class IUsuarioRepository {
  async findById(id)       { throw new Error('Not implemented') }
  async findByEmail(email) { throw new Error('Not implemented') }
  async save(usuario)      { throw new Error('Not implemented') }
}

module.exports = IUsuarioRepository;
