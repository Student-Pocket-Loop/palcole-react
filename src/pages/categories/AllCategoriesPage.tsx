import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import type { Category } from '../../types/Category';
import { CategoryCard } from '../../components/categories/CategoryCard';
import categoriesMock from '../../data/categories.json';

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

    if (isLoading) return <p className="status-loading">Cargando categorías...</p>;
    if (isError) return <div className="status-error">Error: {error?.message}</div>;

    return (
        <section className="list-page">
            <div className="list-header">
                <h1>Listado de Categorías</h1>
                <Link to="/categories/new" className="btn-create">+ Insertar categoría</Link>
            </div>

            {categories && categories.length === 0 ? (
                <p className="empty-state">No hay categorías disponibles.</p>
            ) : (
                <div className="cards-grid">
                    {categories?.map((category) => (
                        <CategoryCard key={category.category_id} category={category} />
                    ))}
                </div>
            )}
        </section>
    );
}
