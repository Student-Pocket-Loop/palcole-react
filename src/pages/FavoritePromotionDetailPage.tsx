import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { FavoritePromotion } from '../types/FavoritePromotion';

export default function FavoritePromotionDetailPage() {
    const { userId, promotionId } = useParams<{ userId: string; promotionId: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: favoritePromotion, isLoading, isError, error } = useQuery<FavoritePromotion, Error>({
        queryKey: ['favorite-promotions', userId, promotionId],
        queryFn: async (): Promise<FavoritePromotion> => {
            const response = await fetch(`http://localhost:3100/api/v1/favorite-promotions/${userId}/${promotionId}`);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Promoción favorita no encontrada');
            }

            return response.json();
        },
        enabled: Boolean(userId && promotionId),
    });

    const deleteMutation = useMutation<void, Error>({
        mutationFn: async (): Promise<void> => {
            const response = await fetch(`http://localhost:3100/api/v1/favorite-promotions/${userId}/${promotionId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error al eliminar el favorito');
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['favorite-promotions'] });
            navigate('/favorite-promotions');
        },
    });

    if (isLoading) return <p>Cargando detalle del favorito...</p>;
    if (isError || !favoritePromotion) return <h3>Error: {error?.message}</h3>;

    return (
        <section>
            <h1>Detalle de la Promoción Favorita</h1>

            <ul>
                <li><strong>User ID:</strong> {favoritePromotion.user_id}</li>
                <li><strong>Promotion ID:</strong> {favoritePromotion.promotion_id}</li>
            </ul>

            {deleteMutation.isError && (
                <p style={{ color: 'red' }}>Error al eliminar: {deleteMutation.error?.message}</p>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <Link to="/favorite-promotions">← Volver</Link>
                <Link to={`/favorite-promotions/edit/${favoritePromotion.user_id}/${favoritePromotion.promotion_id}`}>Editar</Link>
                <button
                    type="button"
                    disabled={deleteMutation.isPending}
                    onClick={() => {
                        if (confirm(`¿Seguro que quieres quitar la promoción #${favoritePromotion.promotion_id} de favoritos del usuario #${favoritePromotion.user_id}?`)) {
                            deleteMutation.mutate();
                        }
                    }}
                >
                    {deleteMutation.isPending ? 'Eliminando...' : 'Eliminar favorito'}
                </button>
            </div>
        </section>
    );
}