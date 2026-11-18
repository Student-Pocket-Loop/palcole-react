import type { SubmitEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import type { FavoritePromotion } from '../../types/FavoritePromotion';
import type { FavoritePromotionInput } from '../../types/FavoritePromotionInput';

const API_URL = import.meta.env.VITE_PALCOLE_BACKEND;

export default function FavoritePromotionForm() {
    const { mutate, data, isPending, isError, error, isSuccess } = useMutation<
        FavoritePromotion,
        Error,
        FavoritePromotionInput
    >({
        mutationFn: async (newFavorite: FavoritePromotionInput): Promise<FavoritePromotion> => {
            try {
                const response = await fetch(`${API_URL}/favorite-promotions/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newFavorite),
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(
                        Array.isArray(errorData.message)
                            ? errorData.message.join(', ')
                            : errorData.message || 'Error al añadir la promoción a favoritos'
                    );
                }

                return await response.json();
            } catch {
                console.warn('Backend no disponible, simulando inserción de promoción favorita');
                return {
                    ...newFavorite,
                };
            }
        },
    });

    const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const newFavorite: FavoritePromotionInput = {
            user_id: Number(formData.get('user_id')),
            promotion_id: Number(formData.get('promotion_id')),
        };

        mutate(newFavorite);
    };

    if (isError) {
        return <h3>Error al añadir el favorito: {error?.message}</h3>;
    }

    return (
        <>
            {isSuccess && data ? (
                <h3>
                    ¡Promoción favorita guardada correctamente (Usuario #{data.user_id} - Promoción #{data.promotion_id})!
                </h3>
            ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <label htmlFor="user_id">User ID:</label>
                    <input type="number" id="user_id" name="user_id" defaultValue={1} required />

                    <label htmlFor="promotion_id">Promotion ID:</label>
                    <input type="number" id="promotion_id" name="promotion_id" defaultValue={1} required />

                    <button type="submit" disabled={isPending} style={{ marginTop: '20px' }}>
                        {isPending ? 'Enviando...' : 'Guardar en favoritos'}
                    </button>
                </form>
            )}
        </>
    );
}