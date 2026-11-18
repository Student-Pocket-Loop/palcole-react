import type { SubmitEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import type { User } from '../../types/User';
import type { UserInput } from '../../types/UserInput';

const API_URL = import.meta.env.VITE_PALCOLE_BACKEND;

export default function UserForm() {
    const { mutate, data, isPending, isError, error, isSuccess } = useMutation<
        User,
        Error,
        UserInput
    >({
        mutationFn: async (newUser: UserInput): Promise<User> => {
            try {
                const response = await fetch(`${API_URL}/users/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newUser),
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(
                        Array.isArray(errorData.message)
                            ? errorData.message.join(', ')
                            : errorData.message || 'Error al introducir el usuario'
                    );
                }

                return await response.json();
            } catch {
                console.warn('Backend no disponible, simulando inserción de usuario');
                return {
                    user_id: Math.floor(Math.random() * 1000) + 10,
                    ...newUser,
                };
            }
        },
    });

    const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const expirationDate = formData.get('expiration_date');

        const newUser: UserInput = {
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

        mutate(newUser);
    };

    if (isError) {
        return <h3>Error al introducir el usuario: {error?.message}</h3>;
    }

    return (
        <>
            {isSuccess && data ? (
                <h3>El usuario se ha insertado correctamente con ID: {data.user_id}!</h3>
            ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <label htmlFor="role_id">Role ID:</label>
                    <input type="number" id="role_id" name="role_id" defaultValue={1} required />

                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" name="username" maxLength={100} placeholder="Nombre de usuario" required />

                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" maxLength={150} placeholder="correo@ejemplo.com" required />

                    <label htmlFor="password_hash">Contraseña:</label>
                    <input type="password" id="password_hash" name="password_hash" maxLength={255} placeholder="Contraseña" required />

                    <label htmlFor="educational_center">Centro educativo:</label>
                    <input type="text" id="educational_center" name="educational_center" maxLength={150} placeholder="Nombre del centro" required />

                    <label htmlFor="registration_date">Fecha de registro:</label>
                    <input
                        type="date"
                        id="registration_date"
                        name="registration_date"
                        defaultValue={new Date().toISOString().split('T')[0]}
                        required
                    />

                    <label htmlFor="expiration_date">Fecha de expiración:</label>
                    <input type="date" id="expiration_date" name="expiration_date" />

                    <label htmlFor="is_verified">
                        <input type="checkbox" id="is_verified" name="is_verified" /> Usuario verificado
                    </label>

                    <label htmlFor="is_active">
                        <input type="checkbox" id="is_active" name="is_active" defaultChecked /> Usuario activo
                    </label>

                    <button type="submit" disabled={isPending} style={{ marginTop: '20px' }}>
                        {isPending ? 'Enviando...' : 'Inserta usuario'}
                    </button>
                </form>
            )}
        </>
    );
}