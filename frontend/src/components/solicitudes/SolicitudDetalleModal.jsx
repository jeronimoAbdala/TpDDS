import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { solicitudesService } from '../../services/solicitudes.service'
import LoadingSpinner from '../common/LoadingSpinner'
import ErrorMessage from '../common/ErrorMessage'
import SolicitudActions from './SolicitudActions'

const ESTADO_LABELS = {
  pendiente: 'Pendiente',
  aprobada: 'Aprobada',
  rechazada: 'Rechazada',
  cancelada: 'Cancelada',
  devuelta: 'Devuelta',
}

export default function SolicitudDetalleModal({ solicitudId, onClose }) {
  const [solicitud, setSolicitud] = useState(null)
  const [historial, setHistorial] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState('')
  const [showHistorial, setShowHistorial] = useState(false)

  const cargarDetalle = async () => {
    setLoading(true)
    setError('')

    try {
      const [detalleRes, historialRes] = await Promise.all([
        solicitudesService.getById(solicitudId),
        solicitudesService.getHistorial(solicitudId),
      ])

      setSolicitud(detalleRes.data)
      setHistorial(historialRes.data)
    } catch (err) {
      setError(err.response?.data?.error ?? 'Error al cargar el detalle.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarDetalle()
  }, [solicitudId])

  const handleAction = async (action) => {
    const confirmar = window.confirm(`¿Confirmás la acción "${action}"?`)
    if (!confirmar) return

    setActionLoading(true)

    try {
      if (action === 'aprobar') await solicitudesService.aprobar(solicitudId)
      if (action === 'rechazar') await solicitudesService.rechazar(solicitudId)
      if (action === 'cancelar') await solicitudesService.cancelar(solicitudId)
      if (action === 'devolver') await solicitudesService.devolver(solicitudId)

      await cargarDetalle()
    } catch (err) {
      alert(err.response?.data?.error ?? 'Ocurrió un error al realizar la acción.')
    } finally {
      setActionLoading(false)
    }
  }

  const equipo =
    solicitud?.equipo?.nombre ??
    solicitud?.equipoNombre ??
    solicitud?.equipoId

  const solicitante =
    solicitud?.usuario?.nombre ??
    solicitud?.usuarioNombre ??
    solicitud?.usuarioId

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <div>
            {solicitud && (
              <div className="modal-meta">
                <span className={`badge badge-${solicitud.estado}`}>
                  {ESTADO_LABELS[solicitud.estado] ?? solicitud.estado}
                </span>
                <span className="modal-id">ID: #{solicitud.id}</span>
              </div>
            )}

            <h2>Detalle de solicitud #{solicitudId}</h2>

            <p className="muted">
              Información completa, historial y acciones disponibles.
            </p>
          </div>

          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            ×
          </button>
        </div>

        {loading && <LoadingSpinner />}

        {!loading && error && (
          <ErrorMessage message={error} />
        )}

        {!loading && !error && solicitud && (
          <>
            <section className="detail-grid">
              <article className="detail-card">
                <span className="detail-label">Equipo</span>
                <strong className="detail-value">{equipo}</strong>
              </article>

              <article className="detail-card">
                <span className="detail-label">Solicitante</span>
                <strong className="detail-value">{solicitante}</strong>
              </article>

              <article className="detail-card">
                <span className="detail-label">Retiro</span>
                <strong className="detail-value">{solicitud.fechaRetiro}</strong>
              </article>

              <article className="detail-card">
                <span className="detail-label">Devolución</span>
                <strong className="detail-value">{solicitud.fechaDevolucion}</strong>
              </article>

              <article className="detail-card detail-card-full">
                <span className="detail-label">Motivo</span>
                <strong className="detail-value">{solicitud.motivo}</strong>
              </article>
            </section>

            {solicitud.estado === 'pendiente' && (
            <div className="modal-edit-action">
                <Link
                to={`/solicitudes/${solicitud.id}/editar`}
                className="btn btn-secondary"
                >
                Editar solicitud
                </Link>
            </div>
            )}

            <div className="modal-actions-row">
            <SolicitudActions
                solicitud={solicitud}
                onAction={handleAction}
                loading={actionLoading}
            />
            </div>

            <section className="historial-section">
              <button
                type="button"
                className="historial-toggle"
                onClick={() => setShowHistorial(!showHistorial)}
              >
                {showHistorial ? 'Ocultar historial' : `Ver historial (${historial.length})`}
              </button>

              {showHistorial && (
                <>
                  {historial.length === 0 ? (
                    <div className="historial-empty">
                      Sin historial registrado.
                    </div>
                  ) : (
                    <ul className="historial-list compact">
                      {historial.map((item) => (
                        <li key={item.id}>
                          <strong>{item.accion}</strong>
                          <span>Usuario {item.usuarioId}</span>
                          <span>{new Date(item.fechaHora).toLocaleString()}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  )
}