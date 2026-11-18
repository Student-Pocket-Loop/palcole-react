import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import type { Category } from '../types/Category';
import { CategoryCard } from '../components/CategoryCard';
import categoriesMock from '../data/categories.json';

const API_URL = import.meta.env.VITE_PALCOLE_BACKEND;

export default function AllCategoriesPage() {
    const { data: categories, isLoading, isError, error } = useQuery<Category[], Error>({
        queryKey: ['categories'],
        queryFn: async (): Promise<Category[]> => {
            try {
                const response = await fetch(`${API_URL}/categories/`);

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || 'Error al obtener las categorías');
                }

                return await response.json();
            } catch {
                console.warn('Backend no disponible, cargando datos mock de categories.json');
                return categoriesMock as Category[];
            }
        },
    });

    if (isLoading) return <p>Cargando categorías...</p>;
    if (isError) return <h3>Error: {error?.message}</h3>;

    return (
        <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h1>Listado de Categorías</h1>
                <Link to="/categories/new">+ Insertar categoría</Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                {categories?.map((category) => (
                    <CategoryCard key={category.category_id} category={category} />
                ))}
            </div>
        </section>
    );
}
