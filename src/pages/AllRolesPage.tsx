import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import type { Role } from '../types/Role';
import { RoleCard } from '../components/RoleCard';

export default function AllRolesPage() {
    const { data: roles, isLoading, isError, error } = useQuery<Role[], Error>({
        queryKey: ['roles'],
        queryFn: async (): Promise<Role[]> => {
            const response = await fetch('http://localhost:3100/api/v1/roles');

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error al obtener los roles');
            }

            return response.json();
        },
    });

    if (isLoading) return <p>Cargando roles...</p>;
    if (isError) return <h3>Error: {error?.message}</h3>;

    return (
        <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h1>Listado de Roles</h1>
                <Link to="/roles/new">+ Insertar rol</Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                {roles?.map((role) => (
                    <RoleCard key={role.role_id} role={role} />
                ))}
            </div>
        </section>
    );
}
