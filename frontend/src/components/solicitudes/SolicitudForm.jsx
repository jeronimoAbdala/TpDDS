import { useState, useEffect } from 'react'
import ErrorMessage from '../common/ErrorMessage'

const EMPTY_FORM = {
  equipoId: '',
  fechaRetiro: '',
  fechaDevolucion: '',
  motivo: '',
}

export default function SolicitudForm({ initialData, equipos, onSubmit, loading, error, isEdit = false }) {
  const [form, setForm] = useState({ ...EMPTY_FORM, ...initialData })

  useEffect(() => {
    if (initialData) setForm((prev) => ({ ...prev, ...initialData }))
  }, [initialData])

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <ErrorMessage message={error} />

      <div className="form-group">
        <label htmlFor="equipoId">Equipo</label>
        <select
          id="equipoId"
          name="equipoId"
          value={form.equipoId}
          onChange={handleChange}
          required
          disabled={isEdit}
        >
          <option value="">Seleccionar equipo...</option>
          {equipos.map((eq) => (
            <option key={eq.id} value={eq.id} disabled={eq.estado !== 'disponible'}>
              {eq.nombre} — {eq.categoria} ({eq.ubicacion})
              {eq.estado !== 'disponible' ? ` [${eq.estado}]` : ''}
              {eq.requiereAutorizacion ? ' ⚠ requiere autorización' : ''}
            </option>
          ))}
        </select>
        {isEdit && <small style={{ color: 'var(--color-text-muted)' }}>El equipo no puede modificarse</small>}
      </div>

      <div className="form-group">
        <label htmlFor="fechaRetiro">Fecha de retiro</label>
        <input
          id="fechaRetiro"
          type="date"
          name="fechaRetiro"
          value={form.fechaRetiro}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="fechaDevolucion">Fecha de devolución</label>
        <input
          id="fechaDevolucion"
          type="date"
          name="fechaDevolucion"
          value={form.fechaDevolucion}
          onChange={handleChange}
          required
          min={form.fechaRetiro || undefined}
        />
      </div>

      <div className="form-group">
        <label htmlFor="motivo">Motivo</label>
        <textarea
          id="motivo"
          name="motivo"
          value={form.motivo}
          onChange={handleChange}
          required
          rows={3}
          placeholder="Justificación del préstamo"
        />
      </div>

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Guardando...' : 'Confirmar'}
      </button>
    </form>
  )
}
