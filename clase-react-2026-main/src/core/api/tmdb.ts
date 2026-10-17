import axios from 'axios'
import { IDIOMA, TMDB_API, TMDB_TOKEN } from '../config/tmdb'

const esTokenV4 = TMDB_TOKEN.startsWith('eyJ')

export const tmdb = axios.create({
  baseURL: TMDB_API,
  params: { language: IDIOMA, ...(!esTokenV4 && { api_key: TMDB_TOKEN }) },
  headers: esTokenV4 ? { Authorization: `Bearer ${TMDB_TOKEN}` } : {},
})

tmdb.interceptors.request.use((config) => {
  if (!TMDB_TOKEN) throw new Error('Falta VITE_TMDB_TOKEN en .env.local')
  return config
})

tmdb.interceptors.response.use(
  (respuesta) => respuesta,
  (error) => {
    if (axios.isCancel(error)) return Promise.reject(error)
    const estado = axios.isAxiosError(error) ? error.response?.status : undefined
    const mensajes: Record<number, string> = {
      401: 'Token de TMDB inválido',
      404: 'No encontramos lo que buscas',
      429: 'Demasiadas peticiones, espera un momento',
    }
    const mensaje = estado ? (mensajes[estado] ?? `TMDB respondió con error ${estado}`) : 'No hay conexión con TMDB'
    return Promise.reject(new Error(mensaje, { cause: error }))
  },
)
