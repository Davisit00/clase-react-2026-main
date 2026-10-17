import { useMemo, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { EsqueletoGrilla } from '@/shared/components/EsqueletoGrilla'
import { MensajeError } from '@/shared/components/MensajeError'
import { Paginador } from '@/shared/components/Paginador'
import { GrillaPeliculas } from '../components/GrillaPeliculas'
import type { PeliculaResumen } from '../models/pelicula'
import { useEstrenos } from '../hooks/usePeliculas'
import type { Region } from '../services/peliculas.service'

interface Props {
  esFavorita: (id: number) => boolean
  onFavorito: (pelicula: PeliculaResumen) => void
}

const paises: { valor: Region; texto: string }[] = [
  { valor: 'VE', texto: 'Venezuela' },
  { valor: 'MX', texto: 'México' },
  { valor: 'ES', texto: 'España' },
  { valor: 'US', texto: 'Estados Unidos' },
]

export function Estrenos({ esFavorita, onFavorito }: Props) {
  const [pais, setPais] = useState<Region>('VE')
  const [pagina, setPagina] = useState(1)
  const consulta = useEstrenos(pagina, pais)
  const proximoEstreno = useMemo(() => {
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    return consulta.datos?.results
      .slice()
      .filter((pelicula) => pelicula.release_date && new Date(`${pelicula.release_date}T00:00:00`) >= hoy)
      .sort((a, b) => a.release_date.localeCompare(b.release_date))[0]
  }, [consulta.datos])
  const diasParaEstreno = proximoEstreno
    ? Math.round((new Date(`${proximoEstreno.release_date}T00:00:00`).getTime() - new Date().setHours(0, 0, 0, 0)) / 86_400_000)
    : undefined

  function cambiarPais(valor: string) {
    setPais(valor as Region)
    setPagina(1)
  }

  return (
    <section>
      <title>Próximos estrenos · Cartelera</title>
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Próximos estrenos</h1>
        <Select value={pais} onValueChange={cambiarPais}>
          <SelectTrigger aria-label="País de estreno"><SelectValue /></SelectTrigger>
          <SelectContent>
            {paises.map((opcion) => <SelectItem key={opcion.valor} value={opcion.valor}>{opcion.texto}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      {consulta.cargando && <EsqueletoGrilla />}
      {consulta.error && <MensajeError mensaje={consulta.error.message} onReintentar={consulta.reintentar} />}
      {!consulta.cargando && !consulta.error && consulta.datos && (
        <>
          {proximoEstreno && diasParaEstreno !== undefined && (
            <p className="mb-6 rounded-lg border bg-card px-4 py-3 text-sm">
              El próximo estreno es <strong>{proximoEstreno.title}</strong>{' '}
              {diasParaEstreno === 0 ? 'se estrena hoy' : `en ${diasParaEstreno} días`}
            </p>
          )}
          <GrillaPeliculas peliculas={consulta.datos.results} esFavorita={esFavorita} onFavorito={onFavorito} />
          <Paginador pagina={pagina} totalPaginas={consulta.datos.total_pages} onCambiar={setPagina} />
        </>
      )}
    </section>
  )
}
