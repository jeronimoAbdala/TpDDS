import { useState, useEffect } from 'react'
import {
  FiAlertTriangle,
  FiArchive,
  FiCheckCircle,
  FiClock,
  FiGrid,
  FiPackage,
} from 'react-icons/fi'
import { solicitudesService } from '../services/solicitudes.service'
import ResumenCard from '../components/resumen/ResumenCard'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'
import PageHero from '../components/common/PageHero'

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

  const disponiblesPorCategoria = resumen?.disponiblesPorCategoria ?? {}

  return (
    <div className="page dashboard-page">
      <PageHero
        eyebrow="Panel administrativo"
        title="Resumen operativo"
        description="Estado general de solicitudes, préstamos y disponibilidad de equipos."
        icon={<FiGrid />}
      />

      <ErrorMessage message={error} />

      {resumen && (
        <>
          <section>
            <div className="section-header">
              <div>
                <h2>Estado general</h2>
                <p>Indicadores principales del circuito de préstamos.</p>
              </div>
            </div>

            <div className="dashboard-kpi-grid">
              <ResumenCard
                title="Pendientes"
                value={resumen.pendientes ?? 0}
                description="solicitudes por aprobar"
                icon={<FiClock />}
                variant="warning"
              />

              <ResumenCard
                title="Equipos prestados"
                value={resumen.prestados ?? 0}
                description="actualmente en préstamo"
                icon={<FiArchive />}
                variant="primary"
              />

              <ResumenCard
                title="Préstamos vencidos"
                value={resumen.vencidas ?? 0}
                description="requieren seguimiento"
                icon={<FiAlertTriangle />}
                variant="danger"
              />

              <ResumenCard
                title="Categorías"
                value={Object.keys(disponiblesPorCategoria).length}
                description="con equipos disponibles"
                icon={<FiCheckCircle />}
                variant="success"
              />
            </div>
          </section>

          <section>
            <div className="section-header">
              <div>
                <h2>Disponibilidad por categoría</h2>
                <p>Equipos disponibles agrupados por tipo.</p>
              </div>
            </div>

            <div className="resumen-grid">
              {Object.entries(disponiblesPorCategoria).map(([cat, count]) => (
                <ResumenCard
                  key={cat}
                  title={cat}
                  value={count}
                  description="disponibles"
                  icon={<FiPackage />}
                  variant="neutral"
                />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  )
}
