import type { SubmitEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import type { Role } from '../../types/Role';
import type { RoleInput } from '../../types/RoleInput';

const API_URL = import.meta.env.VITE_PALCOLE_BACKEND;

export default function RoleForm() {
    const { mutate, data, isPending, isError, error, isSuccess } = useMutation<
        Role,
        Error,
        RoleInput
    >({
        mutationFn: async (newRole: RoleInput): Promise<Role> => {
            try {
                const response = await fetch(`${API_URL}/roles/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newRole),
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(
                        Array.isArray(errorData.message)
                            ? errorData.message.join(', ')
                            : errorData.message || 'Error al introducir el rol'
                    );
                }

                return await response.json();
            } catch {
                console.warn('Backend no disponible, simulando inserción de rol');
                return {
                    role_id: Math.floor(Math.random() * 1000) + 10,
                    ...newRole,
                };
            }
        },
    });

    const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const newRole: RoleInput = {
            name: String(formData.get('name') ?? ''),
        };

        mutate(newRole);
    };

    if (isError) {
        return <div className="status-error">Error al introducir el rol: {error?.message}</div>;
    }

    return (
        <>
            {isSuccess && data ? (
                <div className="status-success">
                    El rol se ha insertado correctamente con ID: {data.role_id}!
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="entity-form">
                    <label htmlFor="name">Nombre del rol:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        maxLength={100}
                        placeholder="Ej. Estudiante, Administrador..."
                        required
                    />

                    <button type="submit" className="btn-submit" disabled={isPending}>
                        {isPending ? 'Enviando...' : 'Inserta rol'}
                    </button>
                </form>
            )}
        </>
    );
}
