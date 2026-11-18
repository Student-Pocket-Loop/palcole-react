import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Promotion } from '../../types/Promotion';
import promotionsMock from '../../data/promotions.json';

const API_URL = import.meta.env.VITE_PALCOLE_BACKEND;

export default function PromotionDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: promotion, isLoading, isError, error } = useQuery<Promotion, Error>({
        queryKey: ['promotions', id],
        queryFn: async (): Promise<Promotion> => {
            try {
                const response = await fetch(`${API_URL}/promotions/${id}`);

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || 'Promoción no encontrada');
                }

                return await response.json();
            } catch {
                console.warn('Backend no disponible, buscando promoción en promotions.json');
                const found = (promotionsMock as Promotion[]).find((p) => p.promotion_id === Number(id));
                if (!found) {
                    throw new Error('Promoción no encontrada en datos mock');
                }
                return found;
            }
        },
        enabled: Boolean(id),
    });

    const deleteMutation = useMutation<void, Error>({
        mutationFn: async (): Promise<void> => {
            try {
                const response = await fetch(`${API_URL}/promotions/${id}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || 'Error al eliminar la promoción');
                }
            } catch {
                console.warn('Backend no disponible, simulando borrado de promoción');
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['promotions'] });
            navigate('/promotions');
        },
    });

    if (isLoading) return <p>Cargando detalle de la promoción...</p>;
    if (isError || !promotion) return <h3>Error: {error?.message}</h3>;

    return (
        <section>
            <h1>Detalle de la Promoción #{promotion.promotion_id}</h1>

            <ul>
                <li><strong>Título:</strong> {promotion.title}</li>
                <li><strong>Descripción:</strong> {promotion.description}</li>
                <li><strong>Category ID:</strong> {promotion.category_id}</li>
                <li><strong>Precio original:</strong> {promotion.original_price} €</li>
                <li><strong>Precio con descuento:</strong> {promotion.discount_price} €</li>
                <li><strong>Descuento:</strong> {promotion.discount_percentage}%</li>
                <li><strong>Código promocional:</strong> {promotion.promo_code}</li>
                <li><strong>Fecha de inicio:</strong> {promotion.start_date?.split('T')[0]}</li>
                <li><strong>Fecha de fin:</strong> {promotion.end_date?.split('T')[0]}</li>
            </ul>

            {deleteMutation.isError && (
                <p style={{ color: 'red' }}>Error al eliminar: {deleteMutation.error?.message}</p>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <Link to="/promotions">← Volver</Link>
                <Link to={`/promotions/edit/${promotion.promotion_id}`}>Editar</Link>
                <button
                    type="button"
                    disabled={deleteMutation.isPending}
                    onClick={() => {
                        if (confirm(`¿Seguro que quieres eliminar la promoción "${promotion.title}"?`)) {
                            deleteMutation.mutate();
                        }
                    }}
                >
                    {deleteMutation.isPending ? 'Eliminando...' : 'Eliminar promoción'}
                </button>
            </div>
        </section>
    );
}
