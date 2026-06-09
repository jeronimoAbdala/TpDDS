import api from './axios'

export const solicitudesService = {
  getAll: (params) => api.get('/solicitudes', { params }),
  getById: (id) => api.get(`/solicitudes/${id}`),
  getHistorial: (id) => api.get(`/solicitudes/${id}/historial`),
  getResumen: () => api.get('/solicitudes/resumen'),
  create: (data) => api.post('/solicitudes', data),
  update: (id, data) => api.put(`/solicitudes/${id}`, data),
  cancelar: (id) => api.patch(`/solicitudes/${id}/cancelar`),
  aprobar: (id) => api.patch(`/solicitudes/${id}/aprobar`),
  rechazar: (id) => api.patch(`/solicitudes/${id}/rechazar`),
  devolver: (id) => api.patch(`/solicitudes/${id}/devolver`),
}
