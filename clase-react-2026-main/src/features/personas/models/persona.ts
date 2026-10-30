import type { PeliculaResumen } from '@/features/peliculas/models/pelicula'

export interface PeliculaConPopularidad extends PeliculaResumen {
  popularity: number
}

export interface Persona {
  id: number
  name: string
  profile_path: string | null
  birthday: string | null
  place_of_birth: string | null
  biography: string
  movie_credits: {
    cast: PeliculaConPopularidad[]
  }
}
