import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import type { AcademicItem } from '../types/AcademicItem';
import { AcademicItemCard } from '../components/AcademicItemCard';
import academicItemsMock from '../data/academic-items.json';

const API_URL = import.meta.env.VITE_PALCOLE_BACKEND;

export default function AllAcademicItemsPage() {
    const { data: items, isLoading, isError, error } = useQuery<AcademicItem[], Error>({
        queryKey: ['academic-items'],
        queryFn: async (): Promise<AcademicItem[]> => {
            try {
                const response = await fetch(`${API_URL}/academic-items/`);

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || 'Error al obtener los recursos académicos');
                }

                return await response.json();
            } catch {
                console.warn('Backend no disponible, cargando datos mock de academic-items.json');
                return academicItemsMock as AcademicItem[];
            }
        },
    });

    if (isLoading) return <p>Cargando recursos académicos...</p>;
    if (isError) return <h3>Error: {error?.message}</h3>;

    return (
        <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h1>Listado de Academic Items</h1>
                <Link to="/academic-items/new">+ Insertar recurso</Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                {items?.map((item) => (
                    <AcademicItemCard key={item.item_id} item={item} />
                ))}
            </div>
        </section>
    );
}
