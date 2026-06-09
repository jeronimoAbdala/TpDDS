import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const ADMIN_ROLES = ['admin', 'encargado']

export default function AdminRoute({ children }) {
  const { token, user } = useAuth()
  if (!token) return <Navigate to="/login" replace />
  if (!ADMIN_ROLES.includes(user?.rol)) return <Navigate to="/solicitudes" replace />
  return children
}
