import { createBrowserRouter, Navigate, useLocation, useNavigate, useOutletContext } from 'react-router'
import App, { type AppContext } from '@/App'
import { CatalogoPeliculas } from '@/features/peliculas/pages/CatalogoPeliculas'
import { Estrenos } from '@/features/peliculas/pages/Estrenos'
import { DetallePelicula } from '@/features/peliculas/pages/DetallePelicula'
import { MisFavoritas } from '@/features/favoritas/pages/MisFavoritas'
import { NoEncontrada } from '@/core/layout/NoEncontrada'
import type { Vista } from '@/core/layout/Header'

function CatalogoRuta() {
  const { esFavorita, alternar } = useOutletContext<AppContext>()
  return <CatalogoPeliculas esFavorita={esFavorita} onFavorito={alternar} />
}

function EstrenosRuta() {
  const { esFavorita, alternar } = useOutletContext<AppContext>()
  return <Estrenos esFavorita={esFavorita} onFavorito={alternar} />
}

function FavoritasRuta() {
  const { favoritas, alternar } = useOutletContext<AppContext>()
  return <MisFavoritas favoritas={favoritas} onFavorito={alternar} onIrAlCatalogo={() => undefined} />
}

export function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const vista: Vista = location.pathname === '/estrenos' ? 'estrenos' : location.pathname === '/favoritas' ? 'favoritas' : 'catalogo'
  return <App vista={vista} onCambiarVista={(nuevaVista) => navigate(nuevaVista === 'estrenos' ? '/estrenos' : nuevaVista === 'favoritas' ? '/favoritas' : '/peliculas')} />
}

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Navigate to="/peliculas" replace /> },
      { path: '/peliculas', element: <CatalogoRuta /> },
      { path: '/peliculas/:id', element: <DetallePelicula /> },
      { path: '/estrenos', element: <EstrenosRuta /> },
      { path: '/favoritas', element: <FavoritasRuta /> },
      { path: '*', element: <NoEncontrada /> },
    ],
  },
])
