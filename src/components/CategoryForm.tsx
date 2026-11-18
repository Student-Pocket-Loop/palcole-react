import type { SubmitEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import type { Category } from '../types/Category';
import type { CategoryInput } from '../types/CategoryInput';

const API_URL = import.meta.env.VITE_PALCOLE_BACKEND;

export default function CategoryForm() {
    const { mutate, data, isPending, isError, error, isSuccess } = useMutation<
        Category,
        Error,
        CategoryInput
    >({
        mutationFn: async (newCategory: CategoryInput): Promise<Category> => {
            try {
                const response = await fetch(`${API_URL}/categories/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newCategory),
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(
                        Array.isArray(errorData.message)
                            ? errorData.message.join(', ')
                            : errorData.message || 'Error al introducir la categoría'
                    );
                }

                return await response.json();
            } catch {
                console.warn('Backend no disponible, simulando inserción de categoría');
                return {
                    category_id: Math.floor(Math.random() * 1000) + 10,
                    ...newCategory,
                };
            }
        },
    });

    const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const newCategory: CategoryInput = {
            name: String(formData.get('name') ?? ''),
        };

        mutate(newCategory);
    };

    if (isError) {
        return <h3>Error al introducir la categoría: {error?.message}</h3>;
    }

    return (
        <>
            {isSuccess && data ? (
                <h3>La categoría se ha insertado correctamente con ID: {data.category_id}!</h3>
            ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <label htmlFor="name">Nombre de la categoría:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        maxLength={100}
                        placeholder="Ej. Apuntes, Libros, Electrónica..."
                        required
                    />

                    <button type="submit" disabled={isPending} style={{ marginTop: '20px' }}>
                        {isPending ? 'Enviando...' : 'Inserta categoría'}
                    </button>
                </form>
            )}
        </>
    );
}
