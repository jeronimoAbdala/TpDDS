import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { solicitudesService } from '../services/solicitudes.service'
import { useAuth } from '../hooks/useAuth'
import SolicitudActions from '../components/solicitudes/SolicitudActions'
import SolicitudHistorial from '../components/solicitudes/SolicitudHistorial'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'

export default function SolicitudDetallePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [solicitud, setSolicitud] = useState(null)
  const [historial, setHistorial] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError('')
      try {
        const [solRes, histRes] = await Promise.all([
          solicitudesService.getById(id),
          solicitudesService.getHistorial(id),
        ])
        setSolicitud(solRes.data)
        setHistorial(histRes.data)
      } catch (err) {
        setError(err.response?.data?.error ?? 'No se pudo cargar la solicitud.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  const handleAction = async (action) => {
    setActionLoading(true)
    setError('')
    try {
      await solicitudesService[action](id)
      navigate('/solicitudes')
    } catch (err) {
      setError(err.response?.data?.error ?? `Error al ejecutar la acción.`)
      setActionLoading(false)
    }
  }

  if (loading) return <LoadingSpinner />

  const isOwner = solicitud && String(solicitud.usuarioId) === String(user?.id)
  const canEdit = solicitud?.estado === 'pendiente' && isOwner

  return (
    <div className="page">
      <div className="page-header">
        <h1>Detalle de solicitud</h1>
        <Link to="/solicitudes">← Volver al listado</Link>
      </div>

      <ErrorMessage message={error} />

      {solicitud && (
        <>
          <div className="card">
            <dl className="detail-list">
              <dt>ID</dt>
              <dd>{solicitud.id}</dd>

              <dt>Equipo</dt>
              <dd>{solicitud.equipoNombre ?? solicitud.equipoId}</dd>

              <dt>Fecha de retiro</dt>
              <dd>{solicitud.fechaRetiro}</dd>

              <dt>Fecha de devolución</dt>
              <dd>{solicitud.fechaDevolucion}</dd>

              <dt>Motivo</dt>
              <dd>{solicitud.motivo}</dd>

              <dt>Estado</dt>
              <dd>
                <span className={`badge badge-${solicitud.estado}`}>{solicitud.estado}</span>
              </dd>

              {solicitud.autorizadoPor && (
                <>
                  <dt>Autorizado por</dt>
                  <dd>{solicitud.autorizadoPor}</dd>
                </>
              )}
            </dl>

            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {canEdit && (
                <Link to={`/solicitudes/${id}/editar`} className="btn btn-secondary">
                  Editar
                </Link>
              )}
              <SolicitudActions
                solicitud={solicitud}
                onAction={handleAction}
                loading={actionLoading}
              />
            </div>
          </div>

          <section>
            <h2>Historial de cambios</h2>
            <SolicitudHistorial historial={historial} />
          </section>
        </>
      )}
    </div>
  )
}
