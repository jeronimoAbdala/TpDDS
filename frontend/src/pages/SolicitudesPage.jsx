import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { solicitudesService } from '../services/solicitudes.service'
import SolicitudTable from '../components/solicitudes/SolicitudTable'
import SolicitudFilters from '../components/solicitudes/SolicitudFilters'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'
import EmptyState from '../components/common/EmptyState'

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

export default function SolicitudesPage() {
  const [solicitudes, setSolicitudes] = useState([])
  const [filters, setFilters] = useState(INITIAL_FILTERS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    const fetchSolicitudes = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await solicitudesService.getAll(filters)
        if (!cancelled) setSolicitudes(res.data.data ?? res.data)
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.error ?? 'Error al cargar las solicitudes.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchSolicitudes()
    return () => { cancelled = true }
  }, [filters])

  const handleFiltersChange = (newFilters) => {
    setFilters({ ...newFilters, page: 1 })
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Solicitudes</h1>
        <Link to="/solicitudes/nueva" className="btn btn-primary">+ Nueva solicitud</Link>
      </div>

      <SolicitudFilters filters={filters} onChange={handleFiltersChange} />

      {loading && <LoadingSpinner />}
      {!loading && error && <ErrorMessage message={error} />}
      {!loading && !error && solicitudes.length === 0 && (
        <EmptyState message="No hay solicitudes para los filtros seleccionados." />
      )}
      {!loading && !error && solicitudes.length > 0 && (
        <SolicitudTable solicitudes={solicitudes} />
      )}
    </div>
  )
}
