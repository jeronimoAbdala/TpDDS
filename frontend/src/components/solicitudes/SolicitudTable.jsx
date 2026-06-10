import { FiEye } from 'react-icons/fi'
const ESTADO_LABELS = {
  pendiente: 'Pendiente',
  aprobada: 'Aprobada',
  rechazada: 'Rechazada',
  cancelada: 'Cancelada',
  devuelta: 'Devuelta',
}

export default function SolicitudTable({ solicitudes, onVerDetalle }) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Equipo</th>
          <th>Retiro</th>
          <th>Devolución</th>
          <th>Motivo</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        {solicitudes.map((s) => (
          <tr key={s.id}>
            <td>{s.id}</td>
            <td>{s.equipo?.nombre ?? s.equipoNombre ?? s.equipoId}</td>
            <td>{s.fechaRetiro}</td>
            <td>{s.fechaDevolucion}</td>
            <td>{s.motivo}</td>
            <td>
              <span className={`badge badge-${s.estado}`}>
                {ESTADO_LABELS[s.estado] ?? s.estado}
              </span>
            </td>
            <td>
              <button
                type="button"
                className="action-icon"
                onClick={() => onVerDetalle(s.id)}
                title="Ver detalle"
              >
                <FiEye />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
