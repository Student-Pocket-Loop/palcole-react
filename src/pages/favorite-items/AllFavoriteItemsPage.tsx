import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import type { FavoriteItem } from '../../types/FavoriteItem';
import { FavoriteItemCard } from '../../components/favorite-items/FavoriteItemCard';
import favoriteItemsMock from '../../data/favorite-items.json';

const API_URL = import.meta.env.VITE_PALCOLE_BACKEND;

export default function AllFavoriteItemsPage() {
    const { data: favoriteItems, isLoading, isError, error } = useQuery<FavoriteItem[], Error>({
        queryKey: ['favorite-items'],
        queryFn: async (): Promise<FavoriteItem[]> => {
            try {
                const response = await fetch(`${API_URL}/favorite-items/`);

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || 'Error al obtener los items favoritos');
                }

                return await response.json();
            } catch {
                console.warn('Backend no disponible, cargando datos mock de favorite-items.json');
                return favoriteItemsMock as FavoriteItem[];
            }
        },
    });

    if (isLoading) return <p>Cargando items favoritos...</p>;
    if (isError) return <h3>Error: {error?.message}</h3>;

    return (
        <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h1>Listado de Favorite Items</h1>
                <Link to="/favorite-items/new">+ Añadir favorito</Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                {favoriteItems?.map((fav) => (
                    <FavoriteItemCard key={`${fav.user_id}-${fav.item_id}`} favoriteItem={fav} />
                ))}
            </div>
        </section>
    );
}
