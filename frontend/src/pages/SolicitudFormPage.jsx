import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { solicitudesService } from '../services/solicitudes.service'
import { equiposService } from '../services/equipos.service'
import SolicitudForm from '../components/solicitudes/SolicitudForm'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'

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
      <div className="page-header">
        <h1>{isEdit ? 'Editar solicitud' : 'Nueva solicitud'}</h1>
        <Link to={isEdit ? `/solicitudes/${id}` : '/solicitudes'}>← Cancelar</Link>
      </div>

      <ErrorMessage message={error} />

      <div className="card">
        <SolicitudForm
          initialData={initialData}
          equipos={equipos}
          onSubmit={handleSubmit}
          loading={submitting}
          error={null}
        />
      </div>
    </div>
  )
}
