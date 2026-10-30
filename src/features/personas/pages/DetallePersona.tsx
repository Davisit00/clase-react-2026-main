import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { imagen } from '@/core/config/tmdb'
import { EsqueletoGrilla } from '@/shared/components/EsqueletoGrilla'
import { MensajeError } from '@/shared/components/MensajeError'
import { GrillaPeliculas } from '@/features/peliculas/components/GrillaPeliculas'
import { usePersona } from '../hooks/usePersona'

function iniciales(nombre: string) {
  return nombre
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0])
    .join('')
}

function fechaNacimiento(fecha: string) {
  return new Intl.DateTimeFormat('es-MX', { dateStyle: 'long' }).format(new Date(`${fecha}T00:00:00`))
}

export function DetallePersona() {
  const { id } = useParams()
  const { datos: persona, error, cargando, reintentar } = usePersona(Number(id))

  if (error) {
    return (
      <>
        <VolverAlCatalogo />
        <MensajeError mensaje={error} onReintentar={reintentar} />
      </>
    )
  }

  if (cargando || !persona) return <EsqueletoPersona />

  const peliculasConocidas = Array.from(
    new Map(
      [...persona.movie_credits.cast]
        .sort((a, b) => b.popularity - a.popularity)
        .map((pelicula) => [pelicula.id, pelicula]),
    ).values(),
  ).slice(0, 15)

  return (
    <article>
      <title>{`${persona.name} · Cartelera`}</title>
      <VolverAlCatalogo />

      <section className="grid gap-8 md:grid-cols-[220px_1fr]">
        <Avatar className="size-48 rounded-2xl md:size-full md:aspect-2/3">
          <AvatarImage src={imagen(persona.profile_path, 'w500') ?? undefined} alt={persona.name} className="object-cover" />
          <AvatarFallback className="rounded-2xl text-4xl">{iniciales(persona.name)}</AvatarFallback>
        </Avatar>

        <div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{persona.name}</h1>
          {persona.birthday && <p className="mt-4 text-muted-foreground">Fecha de nacimiento: {fechaNacimiento(persona.birthday)}</p>}
          {persona.place_of_birth && <p className="text-muted-foreground">Lugar de nacimiento: {persona.place_of_birth}</p>}
          <p className="mt-6 max-w-3xl leading-relaxed">{persona.biography || 'Sin biografía en español'}</p>
        </div>
      </section>

      {peliculasConocidas.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-xl font-bold">Conocido por</h2>
          <GrillaPeliculas peliculas={peliculasConocidas} />
        </section>
      )}
    </article>
  )
}

function VolverAlCatalogo() {
  return (
    <Button variant="ghost" size="sm" asChild className="mb-6 -ml-2 text-muted-foreground">
      <Link to="/peliculas">
        <ArrowLeft /> Catálogo
      </Link>
    </Button>
  )
}

function EsqueletoPersona() {
  return (
    <>
      <VolverAlCatalogo />
      <div className="grid gap-8 md:grid-cols-[220px_1fr]" aria-busy="true" aria-label="Cargando">
        <div className="aspect-2/3 rounded-2xl bg-muted" />
        <div className="space-y-4">
          <div className="h-10 w-2/3 animate-pulse rounded bg-muted" />
          <div className="h-24 w-full animate-pulse rounded bg-muted" />
        </div>
      </div>
      <section className="mt-12">
        <div className="mb-4 h-7 w-40 animate-pulse rounded bg-muted" />
        <EsqueletoGrilla cantidad={5} />
      </section>
    </>
  )
}
