import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { FavoritePromotion } from '../../types/FavoritePromotion';
import favoritePromotionsMock from '../../data/favorite-promotions.json';

const API_URL = import.meta.env.VITE_PALCOLE_BACKEND;

export default function FavoritePromotionDetailPage() {
    const { userId, promotionId } = useParams<{ userId: string; promotionId: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: favoritePromotion, isLoading, isError, error } = useQuery<FavoritePromotion, Error>({
        queryKey: ['favorite-promotions', userId, promotionId],
        queryFn: async (): Promise<FavoritePromotion> => {
            try {
                const response = await fetch(`${API_URL}/favorite-promotions/${userId}/${promotionId}`);

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || 'Promoción favorita no encontrada');
                }

                return await response.json();
            } catch {
                console.warn('Backend no disponible, buscando promoción favorita en favorite-promotions.json');
                const found = (favoritePromotionsMock as FavoritePromotion[]).find(
                    (f) => f.user_id === Number(userId) && f.promotion_id === Number(promotionId)
                );
                if (!found) {
                    throw new Error('Promoción favorita no encontrada en datos mock');
                }
                return found;
            }
        },
        enabled: Boolean(userId && promotionId),
    });

    const deleteMutation = useMutation<void, Error>({
        mutationFn: async (): Promise<void> => {
            try {
                const response = await fetch(`${API_URL}/favorite-promotions/${userId}/${promotionId}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || 'Error al eliminar el favorito');
                }
            } catch {
                console.warn('Backend no disponible, simulando borrado de promoción favorita');
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
