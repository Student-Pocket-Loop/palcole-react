import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import type { User } from '../types/User';
import { UserCard } from '../components/UserCard';
import usersMock from '../data/users.json';

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

    if (isLoading) return <p>Cargando usuarios...</p>;
    if (isError) return <h3>Error: {error?.message}</h3>;

    return (
        <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h1>Listado de Usuarios</h1>
                <Link to="/users/new">+ Insertar usuario</Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                {users?.map((user) => (
                    <UserCard key={user.user_id} user={user} />
                ))}
            </div>
        </section>
    );
}
