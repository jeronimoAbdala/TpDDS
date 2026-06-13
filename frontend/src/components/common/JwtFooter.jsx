import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'

function decodeJwtExp(token) {
  try {
    const payload = token.split('.')[1]
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
    return decoded.exp ?? null
  } catch {
    return null
  }
}

function formatCountdown(seconds) {
  if (seconds <= 0) return 'Expirado'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`
  return `${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`
}

export default function JwtFooter() {
  const { token } = useAuth()
  const [remaining, setRemaining] = useState(null)

  useEffect(() => {
    if (!token) { setRemaining(null); return }
    const exp = decodeJwtExp(token)
    if (!exp) { setRemaining(null); return }

    const update = () => {
      const now = Math.floor(Date.now() / 1000)
      setRemaining(Math.max(0, exp - now))
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [token])

  if (!token || remaining === null) return null

  let statusClass = 'jwt-footer-ok'
  if (remaining < 60) statusClass = 'jwt-footer-danger'
  else if (remaining < 300) statusClass = 'jwt-footer-warning'

  return (
    <div className={`jwt-footer ${statusClass}`}>
      <span className="jwt-footer-label">Sesión JWT</span>
      <span className="jwt-footer-countdown">{formatCountdown(remaining)}</span>
      <span className="jwt-footer-desc">
        {remaining <= 0 ? 'Tu sesión ha expirado' : remaining < 300 ? '— Expira pronto' : '— Activa'}
      </span>
    </div>
  )
}
