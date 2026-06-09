import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/common/Navbar'
import ProtectedRoute from './components/common/ProtectedRoute'
import AdminRoute from './components/common/AdminRoute'
import LoginPage from './pages/LoginPage'
import SolicitudesPage from './pages/SolicitudesPage'
import SolicitudDetallePage from './pages/SolicitudDetallePage'
import SolicitudFormPage from './pages/SolicitudFormPage'
import ResumenPage from './pages/ResumenPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <AuthProvider>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/solicitudes" replace />} />
          <Route
            path="/solicitudes"
            element={<ProtectedRoute><SolicitudesPage /></ProtectedRoute>}
          />
          <Route
            path="/solicitudes/nueva"
            element={<ProtectedRoute><SolicitudFormPage /></ProtectedRoute>}
          />
          <Route
            path="/solicitudes/:id/editar"
            element={<ProtectedRoute><SolicitudFormPage /></ProtectedRoute>}
          />
          <Route
            path="/solicitudes/:id"
            element={<ProtectedRoute><SolicitudDetallePage /></ProtectedRoute>}
          />
          <Route
            path="/resumen"
            element={<AdminRoute><ResumenPage /></AdminRoute>}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </AuthProvider>
  )
}
