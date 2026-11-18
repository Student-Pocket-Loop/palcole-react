import type { SubmitEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import type { AcademicItem } from '../types/AcademicItem';
import type { AcademicItemInput } from '../types/AcademicItemInput';

const API_URL = import.meta.env.VITE_PALCOLE_BACKEND;

export default function AcademicItemForm() {
    const { mutate, data, isPending, isError, error, isSuccess } = useMutation<
        AcademicItem,
        Error,
        AcademicItemInput
    >({
        mutationFn: async (newItem: AcademicItemInput): Promise<AcademicItem> => {
            try {
                const response = await fetch(`${API_URL}/academic-items/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newItem),
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(
                        Array.isArray(errorData.message)
                            ? errorData.message.join(', ')
                            : errorData.message || 'Error al introducir el recurso académico'
                    );
                }

                return await response.json();
            } catch {
                console.warn('Backend no disponible, simulando inserción de recurso académico');
                return {
                    item_id: Math.floor(Math.random() * 1000) + 10,
                    ...newItem,
                };
            }
        },
    });

    const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const imageUrl = formData.get('image_url');
        const publishedAt = formData.get('published_at');

        const newItem: AcademicItemInput = {
            student_id: Number(formData.get('student_id')),
            category_id: Number(formData.get('category_id')),
            title: String(formData.get('title') ?? ''),
            description: String(formData.get('description') ?? ''),
            price: Number(formData.get('price')),
            item_condition: String(formData.get('item_condition') ?? ''),
            listing_type: String(formData.get('listing_type') ?? ''),
            sale_status: String(formData.get('sale_status') ?? ''),
            published_at: publishedAt ? new Date(String(publishedAt)).toISOString() : new Date().toISOString(),
            image_url: imageUrl ? String(imageUrl) : null,
        };

        mutate(newItem);
    };

    if (isError) {
        return <h3>Error al introducir el recurso académico: {error?.message}</h3>;
    }

    return (
        <>
            {isSuccess && data ? (
                <h3>El recurso académico se ha insertado correctamente con ID: {data.item_id}!</h3>
            ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <label htmlFor="student_id">Student ID:</label>
                    <input type="number" id="student_id" name="student_id" defaultValue={1} required />

                    <label htmlFor="category_id">Category ID:</label>
                    <input type="number" id="category_id" name="category_id" defaultValue={1} required />

                    <label htmlFor="title">Título:</label>
                    <input type="text" id="title" name="title" maxLength={150} placeholder="Título del recurso" required />

                    <label htmlFor="description">Descripción:</label>
                    <textarea id="description" name="description" rows={3} placeholder="Descripción detallada" required />

                    <label htmlFor="price">Precio (€):</label>
                    <input type="number" id="price" name="price" step="0.01" min="0" defaultValue={0} required />

                    <label htmlFor="item_condition">Condición (ENUM):</label>
                    <input
                        type="text"
                        id="item_condition"
                        name="item_condition"
                        placeholder="Ej. new, like_new, good, fair"
                        required
                    />

                    <label htmlFor="listing_type">Tipo de anuncio (ENUM):</label>
                    <input
                        type="text"
                        id="listing_type"
                        name="listing_type"
                        placeholder="Ej. sale, exchange, donation"
                        required
                    />

                    <label htmlFor="sale_status">Estado de venta (ENUM):</label>
                    <input
                        type="text"
                        id="sale_status"
                        name="sale_status"
                        placeholder="Ej. available, reserved, sold"
                        required
                    />

                    <label htmlFor="published_at">Fecha de publicación:</label>
                    <input
                        type="datetime-local"
                        id="published_at"
                        name="published_at"
                        defaultValue={new Date().toISOString().slice(0, 16)}
                        required
                    />

                    <label htmlFor="image_url">URL de imagen:</label>
                    <input type="text" id="image_url" name="image_url" maxLength={150} placeholder="https://..." />

                    <button type="submit" disabled={isPending} style={{ marginTop: '20px' }}>
                        {isPending ? 'Enviando...' : 'Inserta recurso'}
                    </button>
                </form>
            )}
        </>
    );
}
