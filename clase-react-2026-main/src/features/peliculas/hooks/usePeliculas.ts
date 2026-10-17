// TODO M6 · Hooks de la feature: combinan useConsulta con el servicio.
//   usePeliculas({ busqueda, genero, orden, pagina })  -> buscar o descubrir
//   useGeneros()                                       -> la lista de géneros (o [])
//   usePelicula(id)                                    -> el detalle (lo usamos en M8)
import { useCallback } from 'react'
import { useConsulta } from '@/shared/hooks/useConsulta'
import { obtenerEstrenos, type Region } from '../services/peliculas.service'

export function useEstrenos(pagina: number, region: Region = 'US') {
  const consultar = useCallback(
    (signal: AbortSignal) => obtenerEstrenos(pagina, signal, region),
    [pagina, region],
  )
  return useConsulta(`estrenos|${region}|${pagina}`, consultar)
}
