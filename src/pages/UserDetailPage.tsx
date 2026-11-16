import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { User } from '../types/User';

export default function UserDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: user, isLoading, isError, error } = useQuery<User, Error>({
        queryKey: ['users', id],
        queryFn: async (): Promise<User> => {
        const response = await fetch(`http://localhost:3100/api/v1/users/${id}`);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Usuario no encontrado');
        }

        return response.json();
        },
        enabled: Boolean(id),
    });

    const deleteMutation = useMutation<void, Error>({
        mutationFn: async (): Promise<void> => {
        const response = await fetch(`http://localhost:3100/api/v1/users/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Error al eliminar el usuario');
        }
        },
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['users'] });
        navigate('/users');
        },
    });

    if (isLoading) return <p>Cargando detalle del usuario...</p>;
    if (isError || !user) return <h3>Error: {error?.message}</h3>;

    return (
        <section>
        <h1>Detalle del Usuario #{user.user_id}</h1>

        <ul>
            <li><strong>Username:</strong> {user.username}</li>
            <li><strong>Role ID:</strong> {user.role_id}</li>
            <li><strong>Email:</strong> {user.email}</li>
            <li><strong>Centro educativo:</strong> {user.educational_center}</li>
            <li><strong>Verificado:</strong> {user.is_verified ? 'Sí' : 'No'}</li>
            <li><strong>Fecha de registro:</strong> {user.registration_date}</li>
            <li><strong>Fecha de expiración:</strong> {user.expiration_date ?? 'Sin fecha'}</li>
            <li><strong>Activo:</strong> {user.is_active ? 'Sí' : 'No'}</li>
        </ul>

        {deleteMutation.isError && (
            <p style={{ color: 'red' }}>Error al eliminar: {deleteMutation.error?.message}</p>
        )}

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
            <Link to="/users">← Volver</Link>
            <Link to={`/users/edit/${user.user_id}`}>Editar</Link>
            <button
            type="button"
            disabled={deleteMutation.isPending}
            onClick={() => {
                if (confirm(`¿Seguro que quieres eliminar a ${user.username}?`)) {
                deleteMutation.mutate();
                }
            }}
            >
            {deleteMutation.isPending ? 'Eliminando...' : 'Eliminar usuario'}
            </button>
        </div>
        </section>
    );
}
