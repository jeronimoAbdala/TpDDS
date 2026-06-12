import EmptyState from '../common/EmptyState'

const ACCION_LABELS = {
  creacion: 'Creación',
  edicion: 'Edición',
  aprobacion: 'Aprobación',
  rechazo: 'Rechazo',
  cancelacion: 'Cancelación',
  devolucion: 'Devolución',
}

const ROL_LABELS = { usuario: 'Usuario', encargado: 'Encargado', admin: 'Admin' }

function formatFecha(fechaHora) {
  try {
    return new Date(fechaHora).toLocaleString('es-AR')
  } catch {
    return fechaHora
  }
}

function tryParse(val) {
  if (!val) return null
  try { return typeof val === 'string' ? JSON.parse(val) : val } catch { return null }
}

function formatCambio(accion, anterior, nuevo) {
  if (accion === 'creacion') return null
  if (anterior?.estado && nuevo?.estado && anterior.estado !== nuevo.estado)
    return `${anterior.estado} → ${nuevo.estado}`
  if (accion === 'edicion' && anterior && nuevo) {
    const campos = ['fechaRetiro', 'fechaDevolucion', 'motivo']
    const changed = campos.filter((c) => anterior[c] !== nuevo[c])
    if (changed.length) return `Cambios en: ${changed.join(', ')}`
  }
  return null
}

export default function SolicitudHistorial({ historial }) {
  if (!historial?.length) {
    return <EmptyState message="Sin historial registrado." />
  }

  return (
    <ul className="historial-list">
      {historial.map((h) => {
        const anterior = tryParse(h.valorAnterior)
        const nuevo = tryParse(h.valorNuevo)
        const cambio = formatCambio(h.accion, anterior, nuevo)
        return (
          <li key={h.id} className="historial-entry">
            <div className="historial-entry-main">
              <span className={`historial-badge historial-badge-${h.accion}`}>
                {ACCION_LABELS[h.accion] ?? h.accion}
              </span>
              <div className="historial-entry-user">
                <strong>{h.usuarioNombre ?? `#${h.usuarioId}`}</strong>
                {h.usuarioRol && (
                  <span className="historial-rol">
                    {ROL_LABELS[h.usuarioRol] ?? h.usuarioRol}
                  </span>
                )}
              </div>
              <span className="historial-entry-fecha">{formatFecha(h.fechaHora)}</span>
            </div>
            {cambio && <div className="historial-entry-cambio">{cambio}</div>}
          </li>
        )
      })}
    </ul>
  )
}
