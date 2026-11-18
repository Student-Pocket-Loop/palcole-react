import type { SubmitEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Category } from '../../types/Category';
import type { CategoryInput } from '../../types/CategoryInput';
import categoriesMock from '../../data/categories.json';

const API_URL = import.meta.env.VITE_PALCOLE_BACKEND;

export default function UpdateCategoryPage() {
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
                console.warn('Backend no disponible, cargando categoría de categories.json para editar');
                const found = (categoriesMock as Category[]).find((c) => c.category_id === Number(id));
                if (!found) {
                    throw new Error('Categoría no encontrada en datos mock');
                }
                return found;
            }
        },
        enabled: Boolean(id),
    });

    const updateMutation = useMutation<Category, Error, CategoryInput>({
        mutationFn: async (updatedCategory: CategoryInput): Promise<Category> => {
            try {
                const response = await fetch(`${API_URL}/categories/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedCategory),
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(
                        Array.isArray(errorData.message)
                            ? errorData.message.join(', ')
                            : errorData.message || 'Error al actualizar la categoría'
                    );
                }

                return await response.json();
            } catch {
                console.warn('Backend no disponible, simulando actualización de categoría');
                return {
                    category_id: Number(id),
                    ...updatedCategory,
                };
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            navigate(`/categories/${id}`);
        },
    });

    const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const updatedCategory: CategoryInput = {
            name: String(formData.get('name') ?? ''),
        };

        updateMutation.mutate(updatedCategory);
    };

    if (isLoading) return <p>Cargando datos de la categoría...</p>;
    if (isError || !category) return <h3>Error: {error?.message}</h3>;

    return (
        <section>
            <h1>Editar Categoría #{category.category_id}</h1>

            {updateMutation.isError && (
                <h3 style={{ color: 'red' }}>Error al actualizar: {updateMutation.error?.message}</h3>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label htmlFor="name">Nombre de la categoría:</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    maxLength={100}
                    defaultValue={category.name}
                    required
                />

                <button type="submit" disabled={updateMutation.isPending} style={{ marginTop: '20px' }}>
                    {updateMutation.isPending ? 'Guardando...' : 'Actualizar categoría'}
                </button>
            </form>

            <br />
            <Link to={`/categories/${category.category_id}`}>← Cancelar y volver</Link>
        </section>
    );
}
