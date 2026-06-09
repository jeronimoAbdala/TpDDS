import EmptyState from '../common/EmptyState'

const ACCION_LABELS = {
  creacion: 'Creación',
  edicion: 'Edición',
  aprobacion: 'Aprobación',
  rechazo: 'Rechazo',
  cancelacion: 'Cancelación',
  devolucion: 'Devolución',
}

function formatFecha(fechaHora) {
  try {
    return new Date(fechaHora).toLocaleString('es-AR')
  } catch {
    return fechaHora
  }
}

export default function SolicitudHistorial({ historial }) {
  if (!historial?.length) {
    return <EmptyState message="Sin historial registrado." />
  }

  return (
    <ul className="historial">
      {historial.map((h) => (
        <li key={h.id} className="historial-item">
          <span className="historial-fecha">{formatFecha(h.fechaHora)}</span>
          <span className="historial-accion">{ACCION_LABELS[h.accion] ?? h.accion}</span>
          <span className="historial-usuario">por {h.usuarioId}</span>
          {h.valorAnterior && (
            <span className="historial-cambio">← {JSON.stringify(h.valorAnterior)}</span>
          )}
          {h.valorNuevo && (
            <span className="historial-cambio">→ {JSON.stringify(h.valorNuevo)}</span>
          )}
        </li>
      ))}
    </ul>
  )
}
