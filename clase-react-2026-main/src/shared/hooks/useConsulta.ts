// TODO M6 · Hook propio: el useEffect + AbortController del catálogo, escrito UNA sola vez.
// Un hook es una función que empieza con "use" y usa otros hooks.
//
// Firma que vamos a escribir:
//   useConsulta<T>(clave: string, consultar: (signal: AbortSignal) => Promise<T>)
//   devuelve { datos, error, cargando, reintentar }
//
// `clave` describe QUÉ se pide (ej. "descubrir|28|popularity.desc|2"). Si cambia, se vuelve a pedir.
// Pista: es mover aquí los useState y el useEffect de CatalogoPeliculas.
import { useCallback, useEffect, useState } from 'react'

export function useConsulta<T>(clave: string, consultar: (signal: AbortSignal) => Promise<T>) {
  const [datos, setDatos] = useState<T>()
  const [error, setError] = useState<Error>()
  const [cargando, setCargando] = useState(true)
  const [intento, setIntento] = useState(0)
  const reintentar = useCallback(() => setIntento((valor) => valor + 1), [])

  useEffect(() => {
    const controller = new AbortController()
    setCargando(true)
    setError(undefined)
    consultar(controller.signal)
      .then((resultado) => { if (!controller.signal.aborted) setDatos(resultado) })
      .catch((consultaError: unknown) => {
        if (!controller.signal.aborted) setError(consultaError instanceof Error ? consultaError : new Error('No se pudo completar la consulta'))
      })
      .finally(() => { if (!controller.signal.aborted) setCargando(false) })
    return () => controller.abort()
  }, [clave, intento, consultar])

  return { datos, error, cargando, reintentar }
}
