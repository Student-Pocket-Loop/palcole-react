import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import type { User } from '../../types/User';
import { UserCard } from '../../components/users/UserCard';
import usersMock from '../../data/users.json';

const API_URL = import.meta.env.VITE_PALCOLE_BACKEND;

export default function AllUsersPage() {
    const { data: users, isLoading, isError, error } = useQuery<User[], Error>({
        queryKey: ['users'],
        queryFn: async (): Promise<User[]> => {
            try {
                const response = await fetch(`${API_URL}/users/`);

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || 'Error al obtener los usuarios');
                }

                return await response.json();
            } catch {
                console.warn('Backend no disponible, cargando datos mock de users.json');
                return usersMock as User[];
            }
        },
    });

    if (isLoading) return <p className="status-loading">Cargando usuarios...</p>;
    if (isError) return <div className="status-error">Error: {error?.message}</div>;

    return (
        <section className="list-page">
            <div className="list-header">
                <h1>Listado de Usuarios</h1>
                <Link to="/users/new" className="btn-create">+ Insertar usuario</Link>
            </div>

            {users && users.length === 0 ? (
                <p className="empty-state">No hay usuarios disponibles.</p>
            ) : (
                <div className="cards-grid">
                    {users?.map((user) => (
                        <UserCard key={user.user_id} user={user} />
                    ))}
                </div>
            )}
        </section>
    );
}
