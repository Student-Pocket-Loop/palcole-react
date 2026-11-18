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

    if (isLoading) return <p className="status-loading">Cargando items favoritos...</p>;
    if (isError) return <div className="status-error">Error: {error?.message}</div>;

    return (
        <section className="list-page">
            <div className="list-header">
                <h1>Listado de Favorite Items</h1>
                <Link to="/favorite-items/new" className="btn-create">+ Añadir favorito</Link>
            </div>

            {favoriteItems && favoriteItems.length === 0 ? (
                <p className="empty-state">No hay items favoritos disponibles.</p>
            ) : (
                <div className="cards-grid">
                    {favoriteItems?.map((fav) => (
                        <FavoriteItemCard key={`${fav.user_id}-${fav.item_id}`} favoriteItem={fav} />
                    ))}
                </div>
            )}
        </section>
    );
}
