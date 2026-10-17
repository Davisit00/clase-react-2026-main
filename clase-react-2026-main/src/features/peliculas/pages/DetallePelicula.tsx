import { useCallback } from 'react'
import { useParams } from 'react-router'
import { imagen } from '@/core/config/tmdb'
import { EsqueletoGrilla } from '@/shared/components/EsqueletoGrilla'
import { MensajeError } from '@/shared/components/MensajeError'
import { useConsulta } from '@/shared/hooks/useConsulta'
import { obtenerDetalle } from '../services/peliculas.service'

export function DetallePelicula() {
  const { id } = useParams()
  const peliculaId = Number(id)
  const consultar = useCallback(
    (signal: AbortSignal) => obtenerDetalle(peliculaId, signal),
    [peliculaId],
  )
  const consulta = useConsulta(`detalle|${peliculaId}`, consultar)

  if (consulta.cargando) return <EsqueletoGrilla cantidad={1} />
  if (consulta.error) return <MensajeError mensaje={consulta.error.message} onReintentar={consulta.reintentar} />
  if (!consulta.datos) return null

  return (
    <article className="grid gap-8 md:grid-cols-[18rem_1fr]">
      <title>{consulta.datos.title} · Cartelera</title>
      {imagen(consulta.datos.poster_path) ? (
        <img src={imagen(consulta.datos.poster_path, 'w500') ?? undefined} alt={`Póster de ${consulta.datos.title}`} className="w-full rounded-xl" />
      ) : null}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{consulta.datos.title}</h1>
        <p className="mt-4 text-muted-foreground">{consulta.datos.overview || 'Esta película no tiene sinopsis disponible.'}</p>
      </div>
    </article>
  )
}
