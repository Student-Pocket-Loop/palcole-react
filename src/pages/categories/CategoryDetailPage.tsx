import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Category } from '../../types/Category';
import categoriesMock from '../../data/categories.json';

const API_URL = import.meta.env.VITE_PALCOLE_BACKEND;

export default function CategoryDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: category, isLoading, isError, error } = useQuery<Category, Error>({
        queryKey: ['categories', id],
        queryFn: async (): Promise<Category> => {
            try {
                const response = await fetch(`${API_URL}/categories/${id}`);

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || 'Categoría no encontrada');
                }

                return await response.json();
            } catch {
                console.warn('Backend no disponible, buscando categoría en categories.json');
                const found = (categoriesMock as Category[]).find((c) => c.category_id === Number(id));
                if (!found) {
                    throw new Error('Categoría no encontrada en datos mock');
                }
                return found;
            }
        },
        enabled: Boolean(id),
    });

    const deleteMutation = useMutation<void, Error>({
        mutationFn: async (): Promise<void> => {
            try {
                const response = await fetch(`${API_URL}/categories/${id}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || 'Error al eliminar la categoría');
                }
            } catch {
                console.warn('Backend no disponible, simulando borrado de categoría');
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            navigate('/categories');
        },
    });

    if (isLoading) return <p>Cargando detalle de la categoría...</p>;
    if (isError || !category) return <h3>Error: {error?.message}</h3>;

    return (
        <section>
            <h1>Detalle de la Categoría #{category.category_id}</h1>

            <ul>
                <li><strong>ID:</strong> {category.category_id}</li>
                <li><strong>Nombre:</strong> {category.name}</li>
            </ul>

            {deleteMutation.isError && (
                <p style={{ color: 'red' }}>Error al eliminar: {deleteMutation.error?.message}</p>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <Link to="/categories">← Volver</Link>
                <Link to={`/categories/edit/${category.category_id}`}>Editar</Link>
                <button
                    type="button"
                    disabled={deleteMutation.isPending}
                    onClick={() => {
                        if (confirm(`¿Seguro que quieres eliminar la categoría "${category.name}"?`)) {
                            deleteMutation.mutate();
                        }
                    }}
                >
                    {deleteMutation.isPending ? 'Eliminando...' : 'Eliminar categoría'}
                </button>
            </div>
        </section>
    );
}
