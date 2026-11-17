import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import type { FavoritePromotion } from '../types/FavoritePromotion';
import { FavoritePromotionCard } from '../components/FavoritePromotioncard';

export default function AllFavoritePromotionsPage() {
    const { data: favoritePromotions, isLoading, isError, error } = useQuery<FavoritePromotion[], Error>({
        queryKey: ['favorite-promotions'],
        queryFn: async (): Promise<FavoritePromotion[]> => {
            const response = await fetch('http://localhost:3100/api/v1/favorite-promotions');

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error al obtener las promociones favoritas');
            }

            return response.json();
        },
    });

    if (isLoading) return <p>Cargando promociones favoritas...</p>;
    if (isError) return <h3>Error: {error?.message}</h3>;

    return (
        <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h1>Listado de Favorite Promotions</h1>
                <Link to="/favorite-promotions/new">+ Añadir favorito</Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                {favoritePromotions?.map((fav) => (
                    <FavoritePromotionCard key={`${fav.user_id}-${fav.promotion_id}`} favoritePromotion={fav} />
                ))}
            </div>
        </section>
    );
}