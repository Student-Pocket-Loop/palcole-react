import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import type { Role } from '../../types/Role';
import { RoleCard } from '../../components/roles/RoleCard';
import rolesMock from '../../data/roles.json';

const API_URL = import.meta.env.VITE_PALCOLE_BACKEND;

export default function AllRolesPage() {
    const { data: roles, isLoading, isError, error } = useQuery<Role[], Error>({
        queryKey: ['roles'],
        queryFn: async (): Promise<Role[]> => {
            try {
                const response = await fetch(`${API_URL}/roles/`);

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || 'Error al obtener los roles');
                }

                return await response.json();
            } catch {
                console.warn('Backend no disponible, cargando datos mock de roles.json');
                return rolesMock as Role[];
            }
        },
    });

    if (isLoading) return <p className="status-loading">Cargando roles...</p>;
    if (isError) return <div className="status-error">Error: {error?.message}</div>;

    return (
        <section className="list-page">
            <div className="list-header">
                <h1>Listado de Roles</h1>
                <Link to="/roles/new" className="btn-create">+ Insertar rol</Link>
            </div>

            {roles && roles.length === 0 ? (
                <p className="empty-state">No hay roles disponibles.</p>
            ) : (
                <div className="cards-grid">
                    {roles?.map((role) => (
                        <RoleCard key={role.role_id} role={role} />
                    ))}
                </div>
            )}
        </section>
    );
}
