import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const ADMIN_ROLES = ['admin', 'encargado']

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  if (!user) return null

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <span className="navbar-brand">Control de Equipamiento</span>
      <div className="navbar-links">
        <Link to="/solicitudes">Solicitudes</Link>
        <Link to="/solicitudes/nueva">Nueva solicitud</Link>
        {ADMIN_ROLES.includes(user.rol) && <Link to="/resumen">Resumen</Link>}
      </div>
      <div className="navbar-user">
        <span>{user.nombre} ({user.rol})</span>
        <button onClick={handleLogout}>Salir</button>
      </div>
    </nav>
  )
}
