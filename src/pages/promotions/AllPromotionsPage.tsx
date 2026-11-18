import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import type { Promotion } from '../../types/Promotion';
import { PromotionCard } from '../../components/promotions/PromotionCard';
import promotionsMock from '../../data/promotions.json';

const API_URL = import.meta.env.VITE_PALCOLE_BACKEND;

export default function AllPromotionsPage() {
    const { data: promotions, isLoading, isError, error } = useQuery<Promotion[], Error>({
        queryKey: ['promotions'],
        queryFn: async (): Promise<Promotion[]> => {
            try {
                const response = await fetch(`${API_URL}/promotions/`);

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || 'Error al obtener las promociones');
                }

                return await response.json();
            } catch {
                console.warn('Backend no disponible, cargando datos mock de promotions.json');
                return promotionsMock as Promotion[];
            }
        },
    });

    if (isLoading) return <p className="status-loading">Cargando promociones...</p>;
    if (isError) return <div className="status-error">Error: {error?.message}</div>;

    return (
        <section className="list-page">
            <div className="list-header">
                <h1>Listado de Promociones</h1>
                <Link to="/promotions/new" className="btn-create">+ Insertar promoción</Link>
            </div>

            {promotions && promotions.length === 0 ? (
                <p className="empty-state">No hay promociones disponibles.</p>
            ) : (
                <div className="cards-grid">
                    {promotions?.map((promotion) => (
                        <PromotionCard key={promotion.promotion_id} promotion={promotion} />
                    ))}
                </div>
            )}
        </section>
    );
}
