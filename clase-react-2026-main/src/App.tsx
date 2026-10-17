import { useState } from 'react'
import { Outlet } from 'react-router'
import { Header, type Vista } from '@/core/layout/Header'
import type { PeliculaResumen } from '@/features/peliculas/models/pelicula'

export interface AppContext {
  favoritas: PeliculaResumen[]
  esFavorita: (id: number) => boolean
  alternar: (pelicula: PeliculaResumen) => void
}

interface Props {
  vista: Vista
  onCambiarVista: (vista: Vista) => void
}

export default function App({ vista, onCambiarVista }: Props) {
  const [favoritas, setFavoritas] = useState<PeliculaResumen[]>([])
  const esFavorita = (id: number) => favoritas.some((pelicula) => pelicula.id === id)
  const alternar = (pelicula: PeliculaResumen) => {
    setFavoritas((actuales) => esFavorita(pelicula.id) ? actuales.filter((actual) => actual.id !== pelicula.id) : [...actuales, pelicula])
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <Header vista={vista} totalFavoritas={favoritas.length} onCambiarVista={onCambiarVista} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
        <Outlet context={{ favoritas, esFavorita, alternar }} />
      </main>
      <footer className="border-t py-6 text-center text-xs text-muted-foreground">
        Datos e imágenes de{' '}
        <a href="https://www.themoviedb.org" target="_blank" rel="noreferrer" className="underline hover:text-foreground">TMDB</a>
        . Este producto usa la API de TMDB pero no está avalado ni certificado por TMDB.
      </footer>
    </div>
  )
}
