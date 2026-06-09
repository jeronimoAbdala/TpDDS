import api from './axios'

export const equiposService = {
  getAll: () => api.get('/equipos'),
}
