import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="page-centered" style={{ flexDirection: 'column', gap: 16, textAlign: 'center' }}>
      <h1 style={{ fontSize: 72, fontWeight: 700, color: '#e5e7eb' }}>404</h1>
      <p style={{ color: '#6b7280', fontSize: 18 }}>La página que buscás no existe.</p>
      <Link to="/solicitudes" className="btn btn-primary">Ir al inicio</Link>
    </div>
  )
}
