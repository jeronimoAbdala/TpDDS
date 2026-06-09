import { Link } from 'react-router-dom'

const ESTADO_LABELS = {
  pendiente: 'Pendiente',
  aprobada: 'Aprobada',
  rechazada: 'Rechazada',
  cancelada: 'Cancelada',
  devuelta: 'Devuelta',
}

export default function SolicitudTable({ solicitudes }) {
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
            <td>{s.equipo?.nombre ?? s.equipoId}</td>
            <td>{s.fechaRetiro}</td>
            <td>{s.fechaDevolucion}</td>
            <td>{s.motivo}</td>
            <td>
              <span className={`badge badge-${s.estado}`}>
                {ESTADO_LABELS[s.estado] ?? s.estado}
              </span>
            </td>
            <td>
              <Link to={`/solicitudes/${s.id}`}>Ver detalle</Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
