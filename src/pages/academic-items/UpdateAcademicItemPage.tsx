import type { SubmitEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AcademicItem } from '../../types/AcademicItem';
import type { AcademicItemInput } from '../../types/AcademicItemInput';
import academicItemsMock from '../../data/academic-items.json';

const API_URL = import.meta.env.VITE_PALCOLE_BACKEND;

export default function UpdateAcademicItemPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: item, isLoading, isError, error } = useQuery<AcademicItem, Error>({
        queryKey: ['academic-items', id],
        queryFn: async (): Promise<AcademicItem> => {
            try {
                const response = await fetch(`${API_URL}/academic-items/${id}`);

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || 'Recurso académico no encontrado');
                }

                return await response.json();
            } catch {
                console.warn('Backend no disponible, cargando recurso de academic-items.json para editar');
                const found = (academicItemsMock as AcademicItem[]).find((i) => i.item_id === Number(id));
                if (!found) {
                    throw new Error('Recurso académico no encontrado en datos mock');
                }
                return found;
            }
        },
        enabled: Boolean(id),
    });

    const updateMutation = useMutation<AcademicItem, Error, AcademicItemInput>({
        mutationFn: async (updatedItem: AcademicItemInput): Promise<AcademicItem> => {
            try {
                const response = await fetch(`${API_URL}/academic-items/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedItem),
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(
                        Array.isArray(errorData.message)
                            ? errorData.message.join(', ')
                            : errorData.message || 'Error al actualizar el recurso académico'
                    );
                }

                return await response.json();
            } catch {
                console.warn('Backend no disponible, simulando actualización de recurso académico');
                return {
                    item_id: Number(id),
                    ...updatedItem,
                };
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['academic-items'] });
            navigate(`/academic-items/${id}`);
        },
    });

    const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const imageUrl = formData.get('image_url');
        const publishedAt = formData.get('published_at');

        const updatedItem: AcademicItemInput = {
            student_id: Number(formData.get('student_id')),
            category_id: Number(formData.get('category_id')),
            title: String(formData.get('title') ?? ''),
            description: String(formData.get('description') ?? ''),
            price: Number(formData.get('price')),
            item_condition: String(formData.get('item_condition') ?? ''),
            listing_type: String(formData.get('listing_type') ?? ''),
            sale_status: String(formData.get('sale_status') ?? ''),
            published_at: publishedAt ? new Date(String(publishedAt)).toISOString() : item!.published_at,
            image_url: imageUrl ? String(imageUrl) : null,
        };

        updateMutation.mutate(updatedItem);
    };

    if (isLoading) return <p className="status-loading">Cargando datos del recurso...</p>;
    if (isError || !item) return <div className="status-error">Error: {error?.message}</div>;

    return (
        <section className="form-page">
            <h1>Editar Recurso #{item.item_id}</h1>

            {updateMutation.isError && (
                <div className="status-error">Error al actualizar: {updateMutation.error?.message}</div>
            )}

            <form onSubmit={handleSubmit} className="entity-form">
                <label htmlFor="student_id">Student ID:</label>
                <input type="number" id="student_id" name="student_id" defaultValue={item.student_id} required />

                <label htmlFor="category_id">Category ID:</label>
                <input type="number" id="category_id" name="category_id" defaultValue={item.category_id} required />

                <label htmlFor="title">Título:</label>
                <input type="text" id="title" name="title" maxLength={150} defaultValue={item.title} required />

                <label htmlFor="description">Descripción:</label>
                <textarea id="description" name="description" rows={3} defaultValue={item.description} required />

                <label htmlFor="price">Precio (€):</label>
                <input type="number" id="price" name="price" step="0.01" min="0" defaultValue={item.price} required />

                <label htmlFor="item_condition">Condición (ENUM):</label>
                <input type="text" id="item_condition" name="item_condition" defaultValue={item.item_condition} required />

                <label htmlFor="listing_type">Tipo de anuncio (ENUM):</label>
                <input type="text" id="listing_type" name="listing_type" defaultValue={item.listing_type} required />

                <label htmlFor="sale_status">Estado de venta (ENUM):</label>
                <input type="text" id="sale_status" name="sale_status" defaultValue={item.sale_status} required />

                <label htmlFor="published_at">Fecha de publicación:</label>
                <input
                    type="datetime-local"
                    id="published_at"
                    name="published_at"
                    defaultValue={item.published_at ? item.published_at.slice(0, 16) : ''}
                    required
                />

                <label htmlFor="image_url">URL de imagen:</label>
                <input
                    type="text"
                    id="image_url"
                    name="image_url"
                    maxLength={150}
                    defaultValue={item.image_url ?? ''}
                />

                <button type="submit" className="btn-submit" disabled={updateMutation.isPending}>
                    {updateMutation.isPending ? 'Guardando...' : 'Actualizar recurso'}
                </button>
            </form>

            <Link to={`/academic-items/${item.item_id}`} className="form-back-link">
                ← Cancelar y volver
            </Link>
        </section>
    );
}
