import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AcademicItem } from '../../types/AcademicItem';
import academicItemsMock from '../../data/academic-items.json';

const API_URL = import.meta.env.VITE_PALCOLE_BACKEND;

export default function AcademicItemDetailPage() {
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
                console.warn('Backend no disponible, buscando recurso en academic-items.json');
                const found = (academicItemsMock as AcademicItem[]).find((i) => i.item_id === Number(id));
                if (!found) {
                    throw new Error('Recurso académico no encontrado en datos mock');
                }
                return found;
            }
        },
        enabled: Boolean(id),
    });

    const deleteMutation = useMutation<void, Error>({
        mutationFn: async (): Promise<void> => {
            try {
                const response = await fetch(`${API_URL}/academic-items/${id}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || 'Error al eliminar el recurso académico');
                }
            } catch {
                console.warn('Backend no disponible, simulando borrado de recurso académico');
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['academic-items'] });
            navigate('/academic-items');
        },
    });

    if (isLoading) return <p className="status-loading">Cargando detalle del recurso...</p>;
    if (isError || !item) return <div className="status-error">Error: {error?.message}</div>;

    return (
        <section className="detail-page">
            <h1>Detalle del Recurso #{item.item_id}</h1>

            <ul className="detail-list">
                <li><strong>Título:</strong> {item.title}</li>
                <li><strong>Descripción:</strong> {item.description}</li>
                <li><strong>Precio:</strong> {item.price} €</li>
                <li><strong>Student ID:</strong> {item.student_id}</li>
                <li><strong>Category ID:</strong> {item.category_id}</li>
                <li><strong>Condición:</strong> {item.item_condition}</li>
                <li><strong>Tipo de anuncio:</strong> {item.listing_type}</li>
                <li><strong>Estado de venta:</strong> {item.sale_status}</li>
                <li><strong>Publicado el:</strong> {item.published_at}</li>
                <li><strong>Imagen URL:</strong> {item.image_url ?? 'Sin imagen'}</li>
            </ul>

            {deleteMutation.isError && (
                <div className="status-error">Error al eliminar: {deleteMutation.error?.message}</div>
            )}

            <div className="detail-actions">
                <Link to="/academic-items" className="btn-back">← Volver</Link>
                <Link to={`/academic-items/edit/${item.item_id}`} className="btn-edit">Editar</Link>
                <button
                    type="button"
                    className="btn-delete"
                    disabled={deleteMutation.isPending}
                    onClick={() => {
                        if (confirm(`¿Seguro que quieres eliminar "${item.title}"?`)) {
                            deleteMutation.mutate();
                        }
                    }}
                >
                    {deleteMutation.isPending ? 'Eliminando...' : 'Eliminar recurso'}
                </button>
            </div>
        </section>
    );
}
