import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import type { Promotion } from '../types/Promotion';
import { PromotionCard } from '../components/PromotionCard';

export default function AllPromotionsPage() {
    const { data: promotions, isLoading, isError, error } = useQuery<Promotion[], Error>({
        queryKey: ['promotions'],
        queryFn: async (): Promise<Promotion[]> => {
            const response = await fetch('http://localhost:3100/api/v1/promotions');

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error al obtener las promociones');
            }

            return response.json();
        },
    });

    if (isLoading) return <p>Cargando promociones...</p>;
    if (isError) return <h3>Error: {error?.message}</h3>;

    return (
        <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h1>Listado de Promociones</h1>
                <Link to="/promotions/new">+ Insertar promoción</Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                {promotions?.map((promotion) => (
                    <PromotionCard key={promotion.promotion_id} promotion={promotion} />
                ))}
            </div>
        </section>
    );
}