import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { User } from '../../types/User';
import usersMock from '../../data/users.json';

const API_URL = import.meta.env.VITE_PALCOLE_BACKEND;

export default function UserDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: user, isLoading, isError, error } = useQuery<User, Error>({
        queryKey: ['users', id],
        queryFn: async (): Promise<User> => {
            try {
                const response = await fetch(`${API_URL}/users/${id}`);

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || 'Usuario no encontrado');
                }

                return await response.json();
            } catch {
                console.warn('Backend no disponible, buscando usuario en users.json');
                const found = (usersMock as User[]).find((u) => u.user_id === Number(id));
                if (!found) {
                    throw new Error('Usuario no encontrado en datos mock');
                }
                return found;
            }
        },
        enabled: Boolean(id),
    });

    const deleteMutation = useMutation<void, Error>({
        mutationFn: async (): Promise<void> => {
            try {
                const response = await fetch(`${API_URL}/users/${id}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || 'Error al eliminar el usuario');
                }
            } catch {
                console.warn('Backend no disponible, simulando borrado de usuario');
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            navigate('/users');
        },
    });

    if (isLoading) return <p className="status-loading">Cargando detalle del usuario...</p>;
    if (isError || !user) return <div className="status-error">Error: {error?.message}</div>;

    return (
        <section className="detail-page">
            <h1>Detalle del Usuario #{user.user_id}</h1>

            <ul className="detail-list">
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
                <div className="status-error">Error al eliminar: {deleteMutation.error?.message}</div>
            )}

            <div className="detail-actions">
                <Link to="/users" className="btn-back">← Volver</Link>
                <Link to={`/users/edit/${user.user_id}`} className="btn-edit">Editar</Link>
                <button
                    type="button"
                    className="btn-delete"
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
