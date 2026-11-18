import type { SubmitEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { FavoriteItem } from '../types/FavoriteItem';
import type { FavoriteItemInput } from '../types/FavoriteItemInput';
import favoriteItemsMock from '../data/favorite-items.json';

const API_URL = import.meta.env.VITE_PALCOLE_BACKEND;

export default function UpdateFavoriteItemPage() {
    const { userId, itemId } = useParams<{ userId: string; itemId: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: favoriteItem, isLoading, isError, error } = useQuery<FavoriteItem, Error>({
        queryKey: ['favorite-items', userId, itemId],
        queryFn: async (): Promise<FavoriteItem> => {
            try {
                const response = await fetch(`${API_URL}/favorite-items/${userId}/${itemId}`);

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || 'Item favorito no encontrado');
                }

                return await response.json();
            } catch {
                console.warn('Backend no disponible, cargando favorito de favorite-items.json para editar');
                const found = (favoriteItemsMock as FavoriteItem[]).find(
                    (f) => f.user_id === Number(userId) && f.item_id === Number(itemId)
                );
                if (!found) {
                    throw new Error('Item favorito no encontrado en datos mock');
                }
                return found;
            }
        },
        enabled: Boolean(userId && itemId),
    });

    const updateMutation = useMutation<FavoriteItem, Error, FavoriteItemInput>({
        mutationFn: async (updatedFavorite: FavoriteItemInput): Promise<FavoriteItem> => {
            try {
                const response = await fetch(`${API_URL}/favorite-items/${userId}/${itemId}`, {
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

                return await response.json();
            } catch {
                console.warn('Backend no disponible, simulando actualización de favorito');
                return {
                    ...updatedFavorite,
                };
            }
        },
        onSuccess: (updatedData) => {
            queryClient.invalidateQueries({ queryKey: ['favorite-items'] });
            navigate(`/favorite-items/${updatedData.user_id}/${updatedData.item_id}`);
        },
    });

    const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const updatedFavorite: FavoriteItemInput = {
            user_id: Number(formData.get('user_id')),
            item_id: Number(formData.get('item_id')),
        };

        updateMutation.mutate(updatedFavorite);
    };

    if (isLoading) return <p>Cargando datos del favorito...</p>;
    if (isError || !favoriteItem) return <h3>Error: {error?.message}</h3>;

    return (
        <section>
            <h1>Editar Favorito (Usuario #{favoriteItem.user_id} - Item #{favoriteItem.item_id})</h1>

            {updateMutation.isError && (
                <h3 style={{ color: 'red' }}>Error al actualizar: {updateMutation.error?.message}</h3>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label htmlFor="user_id">User ID:</label>
                <input type="number" id="user_id" name="user_id" defaultValue={favoriteItem.user_id} required />

                <label htmlFor="item_id">Item ID:</label>
                <input type="number" id="item_id" name="item_id" defaultValue={favoriteItem.item_id} required />

                <button type="submit" disabled={updateMutation.isPending} style={{ marginTop: '20px' }}>
                    {updateMutation.isPending ? 'Guardando...' : 'Actualizar favorito'}
                </button>
            </form>

            <br />
            <Link to={`/favorite-items/${favoriteItem.user_id}/${favoriteItem.item_id}`}>← Cancelar y volver</Link>
        </section>
    );
}
