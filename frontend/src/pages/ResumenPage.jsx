import { useState, useEffect } from 'react'
import { solicitudesService } from '../services/solicitudes.service'
import ResumenCard from '../components/resumen/ResumenCard'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'

export default function ResumenPage() {
  const [resumen, setResumen] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    solicitudesService
      .getResumen()
      .then((r) => setResumen(r.data))
      .catch(() => setError('No se pudo cargar el resumen.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <div className="page">
      <h1>Panel de administración</h1>

      <ErrorMessage message={error} />

      {resumen && (
        <>
          <section>
            <h2>Equipos disponibles por categoría</h2>
            <div className="resumen-grid">
              {Object.entries(resumen.disponiblesPorCategoria ?? {}).map(([cat, count]) => (
                <ResumenCard key={cat} title={cat} value={count} description="disponibles" />
              ))}
            </div>
          </section>

          <section>
            <h2>Estado general</h2>
            <div className="resumen-grid">
              <ResumenCard
                title="Pendientes de aprobación"
                value={resumen.pendientes ?? 0}
              />
              <ResumenCard
                title="Equipos prestados"
                value={resumen.prestados ?? 0}
              />
              <ResumenCard
                title="Préstamos vencidos"
                value={resumen.vencidas ?? 0}
              />
            </div>
          </section>
        </>
      )}
    </div>
  )
}
