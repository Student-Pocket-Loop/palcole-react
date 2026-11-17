import type { SubmitEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import type { FavoriteItem } from '../types/FavoriteItem';
import type { FavoriteItemInput } from '../types/FavoriteItemInput';

export default function FavoriteItemForm() {
    const { mutate, data, isPending, isError, error, isSuccess } = useMutation<
        FavoriteItem,
        Error,
        FavoriteItemInput
    >({
        mutationFn: async (newFavorite: FavoriteItemInput): Promise<FavoriteItem> => {
            const response = await fetch('http://localhost:3100/api/v1/favorite-items', {
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
                        : errorData.message || 'Error al añadir el item a favoritos'
                );
            }

            return response.json();
        },
    });

    const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const newFavorite: FavoriteItemInput = {
            user_id: Number(formData.get('user_id')),
            item_id: Number(formData.get('item_id')),
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
                    ¡Favorito guardado correctamente (Usuario #{data.user_id} - Item #{data.item_id})!
                </h3>
            ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <label htmlFor="user_id">User ID:</label>
                    <input type="number" id="user_id" name="user_id" defaultValue={1} required />

                    <label htmlFor="item_id">Item ID:</label>
                    <input type="number" id="item_id" name="item_id" defaultValue={1} required />

                    <button type="submit" disabled={isPending} style={{ marginTop: '20px' }}>
                        {isPending ? 'Enviando...' : 'Guardar en favoritos'}
                    </button>
                </form>
            )}
        </>
    );
}