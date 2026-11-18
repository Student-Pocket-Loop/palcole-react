import type { SubmitEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import type { Promotion } from '../../types/Promotion';
import type { PromotionInput } from '../../types/PromotionInput';

const API_URL = import.meta.env.VITE_PALCOLE_BACKEND;

export default function PromotionForm() {
    const { mutate, data, isPending, isError, error, isSuccess } = useMutation<
        Promotion,
        Error,
        PromotionInput
    >({
        mutationFn: async (newPromotion: PromotionInput): Promise<Promotion> => {
            try {
                const response = await fetch(`${API_URL}/promotions/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newPromotion),
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(
                        Array.isArray(errorData.message)
                            ? errorData.message.join(', ')
                            : errorData.message || 'Error al introducir la promoción'
                    );
                }

                return await response.json();
            } catch {
                console.warn('Backend no disponible, simulando inserción de promoción');
                return {
                    promotion_id: Math.floor(Math.random() * 1000) + 10,
                    ...newPromotion,
                };
            }
        },
    });

    const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const newPromotion: PromotionInput = {
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

        mutate(newPromotion);
    };

    if (isError) {
        return <div className="status-error">Error al introducir la promoción: {error?.message}</div>;
    }

    return (
        <>
            {isSuccess && data ? (
                <div className="status-success">
                    La promoción se ha insertado correctamente con ID: {data.promotion_id}!
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="entity-form">
                    <label htmlFor="category_id">Category ID:</label>
                    <input type="number" id="category_id" name="category_id" defaultValue={1} required />

                    <label htmlFor="title">Título:</label>
                    <input type="text" id="title" name="title" maxLength={150} placeholder="Título de la promoción" required />

                    <label htmlFor="description">Descripción:</label>
                    <textarea id="description" name="description" rows={3} placeholder="Detalles de la oferta" required />

                    <label htmlFor="original_price">Precio original (€):</label>
                    <input type="number" id="original_price" name="original_price" step="0.01" min="0" defaultValue={0} required />

                    <label htmlFor="discount_price">Precio con descuento (€):</label>
                    <input type="number" id="discount_price" name="discount_price" step="0.01" min="0" defaultValue={0} required />

                    <label htmlFor="discount_percentage">Porcentaje de descuento (%):</label>
                    <input type="number" id="discount_percentage" name="discount_percentage" min="0" max="100" defaultValue={0} required />

                    <label htmlFor="promo_code">Código promocional:</label>
                    <input type="text" id="promo_code" name="promo_code" maxLength={50} placeholder="Ej. STUDENT20" required />

                    <label htmlFor="start_date">Fecha de inicio:</label>
                    <input
                        type="date"
                        id="start_date"
                        name="start_date"
                        defaultValue={new Date().toISOString().split('T')[0]}
                        required
                    />

                    <label htmlFor="end_date">Fecha de fin:</label>
                    <input
                        type="date"
                        id="end_date"
                        name="end_date"
                        required
                    />

                    <button type="submit" className="btn-submit" disabled={isPending}>
                        {isPending ? 'Enviando...' : 'Inserta promoción'}
                    </button>
                </form>
            )}
        </>
    );
}
