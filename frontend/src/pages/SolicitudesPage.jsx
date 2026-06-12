import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { solicitudesService } from '../services/solicitudes.service'
import { equiposService } from '../services/equipos.service'
import SolicitudTable from '../components/solicitudes/SolicitudTable'
import SolicitudFilters from '../components/solicitudes/SolicitudFilters'
import SolicitudDetalleModal from '../components/solicitudes/SolicitudDetalleModal'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'
import EmptyState from '../components/common/EmptyState'
import PageHero from '../components/common/PageHero'

const INITIAL_FILTERS = {
  estado: '',
  categoria: '',
  equipoId: '',
  desde: '',
  hasta: '',
  page: 1,
  limit: 10,
  sortBy: 'fechaRetiro',
  order: 'desc',
}

const SORT_OPTIONS = [
  { value: 'fechaRetiro',     label: 'Fecha retiro' },
  { value: 'fechaDevolucion', label: 'Fecha devolución' },
  { value: 'estado',          label: 'Estado' },
  { value: 'id',              label: 'ID' },
]

export default function SolicitudesPage() {
  const [solicitudes, setSolicitudes] = useState([])
  const [total, setTotal] = useState(0)
  const [filters, setFilters] = useState(INITIAL_FILTERS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedSolicitudId, setSelectedSolicitudId] = useState(null)
  const [equipos, setEquipos] = useState([])

  useEffect(() => {
    equiposService.getAll().then((res) => setEquipos(res.data)).catch(() => {})
  }, [])

  const fetchSolicitudes = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await solicitudesService.getAll(filters)
      setSolicitudes(res.data.data ?? res.data)
      setTotal(res.data.total ?? 0)
    } catch (err) {
      setError(err.response?.data?.error ?? 'Error al cargar las solicitudes.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await solicitudesService.getAll(filters)
        if (!cancelled) {
          setSolicitudes(res.data.data ?? res.data)
          setTotal(res.data.total ?? 0)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.error ?? 'Error al cargar las solicitudes.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [filters])

  const handleFiltersChange = (newFilters) => {
    setFilters({ ...newFilters, page: 1 })
  }

  const handleModalClose = () => {
    setSelectedSolicitudId(null)
    fetchSolicitudes()
  }

  const totalPages = Math.ceil(total / filters.limit) || 1

  return (
    <div className="page">
      <PageHero
        eyebrow="Gestión de préstamos"
        title="Solicitudes"
        description="Consultá, filtrá y administrá solicitudes de equipamiento."
        action={
          <Link to="/solicitudes/nueva" className="btn btn-primary">
            + Nueva solicitud
          </Link>
        }
      />

      <SolicitudFilters
        filters={filters}
        onChange={handleFiltersChange}
        equipos={equipos}
      />

      <div className="sort-bar">
        <div className="sort-bar-left">
          <label>Ordenar por</label>
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters((f) => ({ ...f, sortBy: e.target.value, page: 1 }))}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <button
            className="btn btn-secondary sort-dir-btn"
            onClick={() => setFilters((f) => ({ ...f, order: f.order === 'asc' ? 'desc' : 'asc', page: 1 }))}
            title={filters.order === 'asc' ? 'Ascendente' : 'Descendente'}
          >
            {filters.order === 'asc' ? '↑' : '↓'}
          </button>
        </div>

        {total > 0 && (
          <span className="sort-bar-total">{total} resultado{total !== 1 ? 's' : ''}</span>
        )}
      </div>

      {loading && <LoadingSpinner />}

      {!loading && error && <ErrorMessage message={error} />}

      {!loading && !error && solicitudes.length === 0 && (
        <EmptyState message="No hay solicitudes para los filtros seleccionados." />
      )}

      {!loading && !error && solicitudes.length > 0 && (
        <SolicitudTable
          solicitudes={solicitudes}
          onVerDetalle={setSelectedSolicitudId}
        />
      )}

      {!loading && totalPages > 1 && (
        <div className="pagination">
          <button
            className="btn btn-secondary"
            onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}
            disabled={filters.page <= 1}
          >
            ← Anterior
          </button>
          <span className="pagination-info">
            Página {filters.page} de {totalPages}
          </span>
          <button
            className="btn btn-secondary"
            onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
            disabled={filters.page >= totalPages}
          >
            Siguiente →
          </button>
        </div>
      )}

      {selectedSolicitudId && (
        <SolicitudDetalleModal
          solicitudId={selectedSolicitudId}
          onClose={handleModalClose}
        />
      )}
    </div>
  )
}
