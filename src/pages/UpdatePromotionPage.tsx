import type { SubmitEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Promotion } from '../types/Promotion';
import type { PromotionInput } from '../types/PromotionInput';

export default function UpdatePromotionPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: promotion, isLoading, isError, error } = useQuery<Promotion, Error>({
        queryKey: ['promotions', id],
        queryFn: async (): Promise<Promotion> => {
            const response = await fetch(`http://localhost:3100/api/v1/promotions/${id}`);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Promoción no encontrada');
            }

            return response.json();
        },
        enabled: Boolean(id),
    });

    const updateMutation = useMutation<Promotion, Error, PromotionInput>({
        mutationFn: async (updatedPromotion: PromotionInput): Promise<Promotion> => {
            const response = await fetch(`http://localhost:3100/api/v1/promotions/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedPromotion),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    Array.isArray(errorData.message)
                        ? errorData.message.join(', ')
                        : errorData.message || 'Error al actualizar la promoción'
                );
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['promotions'] });
            navigate(`/promotions/${id}`);
        },
    });

    const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const updatedPromotion: PromotionInput = {
            category_id: Number(formData.get('category_id')),
            title: String(formData.get('title') ?? ''),
            description: String(formData.get('description') ?? ''),
            original_price: Number(formData.get('original_price')),
            discount_price: Number(formData.get('discount_price')),
            discount_percentage: Number(formData.get('discount_percentage')),
            promo_code: String(formData.get('promo_code') ?? ''),
            start_date: String(formData.get('start_date') ?? ''),
            end_date: String(formData.get('end_date') ?? ''),
        };

        updateMutation.mutate(updatedPromotion);
    };

    if (isLoading) return <p>Cargando datos de la promoción...</p>;
    if (isError || !promotion) return <h3>Error: {error?.message}</h3>;

    return (
        <section>
            <h1>Editar Promoción #{promotion.promotion_id}</h1>

            {updateMutation.isError && (
                <h3 style={{ color: 'red' }}>Error al actualizar: {updateMutation.error?.message}</h3>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label htmlFor="category_id">Category ID:</label>
                <input type="number" id="category_id" name="category_id" defaultValue={promotion.category_id} required />

                <label htmlFor="title">Título:</label>
                <input type="text" id="title" name="title" maxLength={150} defaultValue={promotion.title} required />

                <label htmlFor="description">Descripción:</label>
                <textarea id="description" name="description" rows={3} defaultValue={promotion.description} required />

                <label htmlFor="original_price">Precio original (€):</label>
                <input type="number" id="original_price" name="original_price" step="0.01" min="0" defaultValue={promotion.original_price} required />

                <label htmlFor="discount_price">Precio con descuento (€):</label>
                <input type="number" id="discount_price" name="discount_price" step="0.01" min="0" defaultValue={promotion.discount_price} required />

                <label htmlFor="discount_percentage">Porcentaje de descuento (%):</label>
                <input type="number" id="discount_percentage" name="discount_percentage" min="0" max="100" defaultValue={promotion.discount_percentage} required />

                <label htmlFor="promo_code">Código promocional:</label>
                <input type="text" id="promo_code" name="promo_code" maxLength={50} defaultValue={promotion.promo_code} required />

                <label htmlFor="start_date">Fecha de inicio:</label>
                <input
                    type="date"
                    id="start_date"
                    name="start_date"
                    defaultValue={promotion.start_date?.split('T')[0]}
                    required
                />

                <label htmlFor="end_date">Fecha de fin:</label>
                <input
                    type="date"
                    id="end_date"
                    name="end_date"
                    defaultValue={promotion.end_date?.split('T')[0]}
                    required
                />

                <button type="submit" disabled={updateMutation.isPending} style={{ marginTop: '20px' }}>
                    {updateMutation.isPending ? 'Guardando...' : 'Actualizar promoción'}
                </button>
            </form>

            <br />
            <Link to={`/promotions/${promotion.promotion_id}`}>← Cancelar y volver</Link>
        </section>
    );
}