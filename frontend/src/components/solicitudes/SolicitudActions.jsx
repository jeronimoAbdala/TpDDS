import { useAuth } from '../../hooks/useAuth'

const ADMIN_ROLES = ['admin', 'encargado']

export default function SolicitudActions({ solicitud, onAction, loading }) {
  const { user } = useAuth()

  const isAdmin = ADMIN_ROLES.includes(user?.rol)
  const isOwner = String(solicitud.usuarioId) === String(user?.id)

  const canApprove = isAdmin && solicitud.estado === 'pendiente'
  const canReject = isAdmin && solicitud.estado === 'pendiente'
  const canReturn = isAdmin && solicitud.estado === 'aprobada'
  const canCancel = isOwner && !['devuelta', 'cancelada', 'rechazada'].includes(solicitud.estado)

  if (!canApprove && !canReject && !canReturn && !canCancel) return null

  return (
    <div className="actions">
      {canApprove && (
        <button className="btn btn-success" onClick={() => onAction('aprobar')} disabled={loading}>
          Aprobar
        </button>
      )}
      {canReject && (
        <button className="btn btn-danger" onClick={() => onAction('rechazar')} disabled={loading}>
          Rechazar
        </button>
      )}
      {canReturn && (
        <button className="btn btn-primary" onClick={() => onAction('devolver')} disabled={loading}>
          Marcar devuelta
        </button>
      )}
      {canCancel && (
        <button className="btn btn-warning" onClick={() => onAction('cancelar')} disabled={loading}>
          Cancelar
        </button>
      )}
    </div>
  )
}
