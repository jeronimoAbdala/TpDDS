import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { authService } from '../services/auth.service'
import ErrorMessage from '../components/common/ErrorMessage'

export default function LoginPage() {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ nombre: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      if (mode === 'login') {
        const res = await authService.login(form.email, form.password)
        login(res.data.usuario, res.data.token)
        navigate('/solicitudes')
      } else {
        await authService.register(form)
        setSuccess('Registro exitoso. Iniciá sesión.')
        setMode('login')
        setForm((prev) => ({ ...prev, nombre: '' }))
      }
    } catch (err) {
      setError(err.response?.data?.error ?? 'Error al procesar la solicitud.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-centered">
      <div className="card">
        <h2>{mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}</h2>

        {success && <div style={{ color: 'green', marginBottom: 12 }}>{success}</div>}
        <ErrorMessage message={error} />

        <form className="form" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="form-group">
              <label htmlFor="nombre">Nombre</label>
              <input
                id="nombre"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
                placeholder="Tu nombre completo"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="usuario@ejemplo.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Cargando...' : mode === 'login' ? 'Ingresar' : 'Crear cuenta'}
          </button>
        </form>

        <p className="toggle-mode">
          {mode === 'login' ? (
            <>
              ¿No tenés cuenta?{' '}
              <button className="link-btn" onClick={() => { setMode('register'); setError('') }}>
                Registrate
              </button>
            </>
          ) : (
            <>
              ¿Ya tenés cuenta?{' '}
              <button className="link-btn" onClick={() => { setMode('login'); setError('') }}>
                Iniciá sesión
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  )
}
