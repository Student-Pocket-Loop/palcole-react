import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { FavoriteItem } from '../types/FavoriteItem';
import favoriteItemsMock from '../data/favorite-items.json';

const API_URL = import.meta.env.VITE_PALCOLE_BACKEND;

export default function FavoriteItemDetailPage() {
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
                console.warn('Backend no disponible, buscando favorito en favorite-items.json');
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

    const deleteMutation = useMutation<void, Error>({
        mutationFn: async (): Promise<void> => {
            try {
                const response = await fetch(`${API_URL}/favorite-items/${userId}/${itemId}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || 'Error al eliminar el favorito');
                }
            } catch {
                console.warn('Backend no disponible, simulando borrado de favorito');
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['favorite-items'] });
            navigate('/favorite-items');
        },
    });

    if (isLoading) return <p>Cargando detalle del favorito...</p>;
    if (isError || !favoriteItem) return <h3>Error: {error?.message}</h3>;

    return (
        <section>
            <h1>Detalle del Favorito</h1>

            <ul>
                <li><strong>User ID:</strong> {favoriteItem.user_id}</li>
                <li><strong>Item ID:</strong> {favoriteItem.item_id}</li>
            </ul>

            {deleteMutation.isError && (
                <p style={{ color: 'red' }}>Error al eliminar: {deleteMutation.error?.message}</p>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <Link to="/favorite-items">← Volver</Link>
                <Link to={`/favorite-items/edit/${favoriteItem.user_id}/${favoriteItem.item_id}`}>Editar</Link>
                <button
                    type="button"
                    disabled={deleteMutation.isPending}
                    onClick={() => {
                        if (confirm(`¿Seguro que quieres quitar el item #${favoriteItem.item_id} de favoritos del usuario #${favoriteItem.user_id}?`)) {
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
