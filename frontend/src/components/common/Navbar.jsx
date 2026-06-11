import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const ADMIN_ROLES = ['admin', 'encargado']

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  if (!user) return null

  const handleLogout = () => {
    logout()
    setOpen(false)
    navigate('/login')
  }

  const closeMenu = () => {
    setOpen(false)
  }

  return (
    <>
      <nav className="navbar">
        <div className="navbar-main">
          <div className="navbar-left">
            <button
              type="button"
              className="navbar-toggle"
              onClick={() => setOpen(!open)}
              aria-label="Abrir menú"
            >
              ☰
            </button>

            <span className="navbar-brand">
              Control de Equipamiento
            </span>
          </div>

          <div className="navbar-user-desktop">
            <span>{user.nombre}</span>

            <button type="button" onClick={handleLogout}>
              Salir
            </button>
          </div>
        </div>
      </nav>

{open && (
  <>
    <div className="sidebar-overlay" onClick={closeMenu} />

    <aside className="sidebar-menu">
      <Link to="/solicitudes" onClick={closeMenu}>
        Solicitudes
      </Link>

      <Link to="/solicitudes/nueva" onClick={closeMenu}>
        Nueva solicitud
      </Link>

      {ADMIN_ROLES.includes(user.rol) && (
        <Link to="/resumen" onClick={closeMenu}>
          Resumen
        </Link>
      )}
    </aside>
  </>
)}

    </>
  )
}