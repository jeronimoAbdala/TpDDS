import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { solicitudesService } from '../services/solicitudes.service'
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

export default function SolicitudesPage() {
  const [solicitudes, setSolicitudes] = useState([])
  const [filters, setFilters] = useState(INITIAL_FILTERS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedSolicitudId, setSelectedSolicitudId] = useState(null)

  const fetchSolicitudes = async () => {
    setLoading(true)
    setError('')

    try {
      const res = await solicitudesService.getAll(filters)
      setSolicitudes(res.data.data ?? res.data)
    } catch (err) {
      setError(
        err.response?.data?.error ??
        'Error al cargar las solicitudes.'
      )
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
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.error ??
            'Error al cargar las solicitudes.'
          )
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [filters])

  const handleFiltersChange = (newFilters) => {
    setFilters({
      ...newFilters,
      page: 1,
    })
  }

  const handleModalClose = () => {
    setSelectedSolicitudId(null)
    fetchSolicitudes()
  }

  return (
    <div className="page">
      <PageHero
        eyebrow="Gestión de préstamos"
        title="Solicitudes"
        description="Consultá, filtrá y administrá solicitudes de equipamiento."
        action={
          <Link
            to="/solicitudes/nueva"
            className="btn btn-primary"
          >
            + Nueva solicitud
          </Link>
        }
      />

      <SolicitudFilters
        filters={filters}
        onChange={handleFiltersChange}
      />

      {loading && <LoadingSpinner />}

      {!loading && error && (
        <ErrorMessage message={error} />
      )}

      {!loading && !error && solicitudes.length === 0 && (
        <EmptyState message="No hay solicitudes para los filtros seleccionados." />
      )}

      {!loading && !error && solicitudes.length > 0 && (
        <SolicitudTable
          solicitudes={solicitudes}
          onVerDetalle={setSelectedSolicitudId}
        />
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
