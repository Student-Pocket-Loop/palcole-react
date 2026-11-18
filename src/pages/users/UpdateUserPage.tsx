import type { SubmitEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { User } from '../../types/User';
import type { UserInput } from '../../types/UserInput';
import usersMock from '../../data/users.json';

const API_URL = import.meta.env.VITE_PALCOLE_BACKEND;

export default function UpdateUserPage() {
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
                console.warn('Backend no disponible, cargando usuario de users.json para editar');
                const found = (usersMock as User[]).find((u) => u.user_id === Number(id));
                if (!found) {
                    throw new Error('Usuario no encontrado en datos mock');
                }
                return found;
            }
        },
        enabled: Boolean(id),
    });

    const updateMutation = useMutation<User, Error, UserInput>({
        mutationFn: async (updatedUser: UserInput): Promise<User> => {
            try {
                const response = await fetch(`${API_URL}/users/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedUser),
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(
                        Array.isArray(errorData.message)
                            ? errorData.message.join(', ')
                            : errorData.message || 'Error al actualizar el usuario'
                    );
                }

                return await response.json();
            } catch {
                console.warn('Backend no disponible, simulando actualización de usuario');
                return {
                    user_id: Number(id),
                    ...updatedUser,
                };
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            navigate(`/users/${id}`);
        },
    });

    const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const expirationDate = formData.get('expiration_date');

        const updatedUser: UserInput = {
            role_id: Number(formData.get('role_id')),
            username: String(formData.get('username') ?? ''),
            email: String(formData.get('email') ?? ''),
            password_hash: String(formData.get('password_hash') ?? ''),
            educational_center: String(formData.get('educational_center') ?? ''),
            is_verified: formData.get('is_verified') === 'on',
            registration_date: String(formData.get('registration_date') ?? ''),
            expiration_date: expirationDate ? String(expirationDate) : null,
            is_active: formData.get('is_active') === 'on',
        };

        updateMutation.mutate(updatedUser);
    };

    if (isLoading) return <p>Cargando datos del usuario...</p>;
    if (isError || !user) return <h3>Error: {error?.message}</h3>;

    return (
        <section>
            <h1>Editar Usuario #{user.user_id}</h1>

            {updateMutation.isError && (
                <h3 style={{ color: 'red' }}>Error al actualizar: {updateMutation.error?.message}</h3>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label htmlFor="role_id">Role ID:</label>
                <input type="number" id="role_id" name="role_id" defaultValue={user.role_id} required />

                <label htmlFor="username">Username:</label>
                <input type="text" id="username" name="username" maxLength={100} defaultValue={user.username} required />

                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" maxLength={150} defaultValue={user.email} required />

                <label htmlFor="password_hash">Contraseña:</label>
                <input
                    type="password"
                    id="password_hash"
                    name="password_hash"
                    maxLength={255}
                    defaultValue={user.password_hash ?? ''}
                    required
                />

                <label htmlFor="educational_center">Centro educativo:</label>
                <input
                    type="text"
                    id="educational_center"
                    name="educational_center"
                    maxLength={150}
                    defaultValue={user.educational_center}
                    required
                />

                <label htmlFor="registration_date">Fecha de registro:</label>
                <input
                    type="date"
                    id="registration_date"
                    name="registration_date"
                    defaultValue={user.registration_date?.split('T')[0]}
                    required
                />

                <label htmlFor="expiration_date">Fecha de expiración:</label>
                <input
                    type="date"
                    id="expiration_date"
                    name="expiration_date"
                    defaultValue={user.expiration_date ? user.expiration_date.split('T')[0] : ''}
                />

                <label htmlFor="is_verified">
                    <input type="checkbox" id="is_verified" name="is_verified" defaultChecked={user.is_verified} /> Usuario verificado
                </label>

                <label htmlFor="is_active">
                    <input type="checkbox" id="is_active" name="is_active" defaultChecked={user.is_active} /> Usuario activo
                </label>

                <button type="submit" disabled={updateMutation.isPending} style={{ marginTop: '20px' }}>
                    {updateMutation.isPending ? 'Guardando...' : 'Actualizar usuario'}
                </button>
            </form>

            <br />
            <Link to={`/users/${user.user_id}`}>← Cancelar y volver</Link>
        </section>
    );
}
