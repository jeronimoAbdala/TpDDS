const ESTADOS = ['pendiente', 'aprobada', 'rechazada', 'cancelada', 'devuelta']
const CATEGORIAS = ['notebook', 'proyector', 'cámara', 'kit de red']

export default function SolicitudFilters({ filters, onChange, equipos = [] }) {
  const handleChange = (e) => {
    onChange({ ...filters, [e.target.name]: e.target.value })
  }

  return (
    <div className="filters">
      <select name="estado" value={filters.estado} onChange={handleChange}>
        <option value="">Todos los estados</option>
        {ESTADOS.map((e) => (
          <option key={e} value={e}>{e}</option>
        ))}
      </select>

      <select name="categoria" value={filters.categoria} onChange={handleChange}>
        <option value="">Todas las categorías</option>
        {CATEGORIAS.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      {equipos.length > 0 && (
        <select name="equipoId" value={filters.equipoId} onChange={handleChange}>
          <option value="">Todos los equipos</option>
          {equipos.map((eq) => (
            <option key={eq.id} value={eq.id}>
              {eq.nombre} ({eq.categoria})
            </option>
          ))}
        </select>
      )}

      <input
        type="date"
        name="desde"
        value={filters.desde}
        onChange={handleChange}
        title="Desde"
      />

      <input
        type="date"
        name="hasta"
        value={filters.hasta}
        onChange={handleChange}
        title="Hasta"
      />
    </div>
  )
}
