import type { SubmitEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { FavoritePromotion } from '../types/FavoritePromotion';
import type { FavoritePromotionInput } from '../types/FavoritePromotionInput';

export default function UpdateFavoritePromotionPage() {
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

    const updateMutation = useMutation<FavoritePromotion, Error, FavoritePromotionInput>({
        mutationFn: async (updatedFavorite: FavoritePromotionInput): Promise<FavoritePromotion> => {
            const response = await fetch(`http://localhost:3100/api/v1/favorite-promotions/${userId}/${promotionId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedFavorite),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    Array.isArray(errorData.message)
                        ? errorData.message.join(', ')
                        : errorData.message || 'Error al actualizar el favorito'
                );
            }

            return response.json();
        },
        onSuccess: (updatedData) => {
            queryClient.invalidateQueries({ queryKey: ['favorite-promotions'] });
            navigate(`/favorite-promotions/${updatedData.user_id}/${updatedData.promotion_id}`);
        },
    });

    const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const updatedFavorite: FavoritePromotionInput = {
            user_id: Number(formData.get('user_id')),
            promotion_id: Number(formData.get('promotion_id')),
        };

        updateMutation.mutate(updatedFavorite);
    };

    if (isLoading) return <p>Cargando datos del favorito...</p>;
    if (isError || !favoritePromotion) return <h3>Error: {error?.message}</h3>;

    return (
        <section>
            <h1>Editar Favorito (Usuario #{favoritePromotion.user_id} - Promoción #{favoritePromotion.promotion_id})</h1>

            {updateMutation.isError && (
                <h3 style={{ color: 'red' }}>Error al actualizar: {updateMutation.error?.message}</h3>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label htmlFor="user_id">User ID:</label>
                <input type="number" id="user_id" name="user_id" defaultValue={favoritePromotion.user_id} required />

                <label htmlFor="promotion_id">Promotion ID:</label>
                <input type="number" id="promotion_id" name="promotion_id" defaultValue={favoritePromotion.promotion_id} required />

                <button type="submit" disabled={updateMutation.isPending} style={{ marginTop: '20px' }}>
                    {updateMutation.isPending ? 'Guardando...' : 'Actualizar favorito'}
                </button>
            </form>

            <br />
            <Link to={`/favorite-promotions/${favoritePromotion.user_id}/${favoritePromotion.promotion_id}`}>← Cancelar y volver</Link>
        </section>
    );
}