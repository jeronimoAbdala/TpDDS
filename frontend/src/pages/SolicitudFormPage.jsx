import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { solicitudesService } from '../services/solicitudes.service'
import { equiposService } from '../services/equipos.service'
import SolicitudForm from '../components/solicitudes/SolicitudForm'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'
import PageHero from '../components/common/PageHero'

export default function SolicitudFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [equipos, setEquipos] = useState([])
  const [initialData, setInitialData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const requests = [equiposService.getAll()]
    if (isEdit) requests.push(solicitudesService.getById(id))

    Promise.all(requests)
      .then(([equiposRes, solicitudRes]) => {
        setEquipos(equiposRes.data)
        if (solicitudRes) setInitialData(solicitudRes.data)
      })
      .catch(() => setError('Error al cargar los datos necesarios.'))
      .finally(() => setLoading(false))
  }, [id, isEdit])

  const handleSubmit = async (data) => {
    setSubmitting(true)
    setError('')
    try {
      if (isEdit) {
        await solicitudesService.update(id, data)
      } else {
        await solicitudesService.create(data)
      }
      navigate('/solicitudes')
    } catch (err) {
      setError(err.response?.data?.error ?? 'Error al guardar la solicitud.')
      setSubmitting(false)
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="page">
    <PageHero
  eyebrow="Gestión de préstamos"
  title={isEdit ? 'Editar solicitud' : 'Nueva solicitud'}
  description={
    isEdit
      ? 'Modificá los datos permitidos de una solicitud pendiente.'
      : 'Registrá una nueva solicitud de préstamo de equipamiento.'
  }
  action={
    <Link
      to="/solicitudes"
      className="btn btn-primary"
    >
      ← Volver
    </Link>
  }
/>

      <ErrorMessage message={error} />

      <div className="card">
        <SolicitudForm
          initialData={initialData}
          equipos={equipos}
          onSubmit={handleSubmit}
          loading={submitting}
          error={null}
          isEdit={isEdit}
        />
      </div>
    </div>
  )
}
