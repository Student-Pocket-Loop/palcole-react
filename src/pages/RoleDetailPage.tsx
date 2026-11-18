import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Role } from '../types/Role';
import rolesMock from '../data/roles.json';

const API_URL = import.meta.env.VITE_PALCOLE_BACKEND;

export default function RoleDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: role, isLoading, isError, error } = useQuery<Role, Error>({
        queryKey: ['roles', id],
        queryFn: async (): Promise<Role> => {
            try {
                const response = await fetch(`${API_URL}/roles/${id}`);

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || 'Rol no encontrado');
                }

                return await response.json();
            } catch {
                console.warn('Backend no disponible, buscando rol en roles.json');
                const found = (rolesMock as Role[]).find((r) => r.role_id === Number(id));
                if (!found) {
                    throw new Error('Rol no encontrado en datos mock');
                }
                return found;
            }
        },
        enabled: Boolean(id),
    });

    const deleteMutation = useMutation<void, Error>({
        mutationFn: async (): Promise<void> => {
            try {
                const response = await fetch(`${API_URL}/roles/${id}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || 'Error al eliminar el rol');
                }
            } catch {
                console.warn('Backend no disponible, simulando borrado de rol');
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['roles'] });
            navigate('/roles');
        },
    });

    if (isLoading) return <p>Cargando detalle del rol...</p>;
    if (isError || !role) return <h3>Error: {error?.message}</h3>;

    return (
        <section>
            <h1>Detalle del Rol #{role.role_id}</h1>

            <ul>
                <li><strong>ID:</strong> {role.role_id}</li>
                <li><strong>Nombre:</strong> {role.name}</li>
            </ul>

            {deleteMutation.isError && (
                <p style={{ color: 'red' }}>Error al eliminar: {deleteMutation.error?.message}</p>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <Link to="/roles">← Volver</Link>
                <Link to={`/roles/edit/${role.role_id}`}>Editar</Link>
                <button
                    type="button"
                    disabled={deleteMutation.isPending}
                    onClick={() => {
                        if (confirm(`¿Seguro que quieres eliminar el rol "${role.name}"?`)) {
                            deleteMutation.mutate();
                        }
                    }}
                >
                    {deleteMutation.isPending ? 'Eliminando...' : 'Eliminar rol'}
                </button>
            </div>
        </section>
    );
}
