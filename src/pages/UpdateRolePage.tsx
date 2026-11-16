import type { SubmitEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Role } from '../types/Role';
import type { RoleInput } from '../types/RoleInput';

export default function UpdateRolePage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: role, isLoading, isError, error } = useQuery<Role, Error>({
        queryKey: ['roles', id],
        queryFn: async (): Promise<Role> => {
            const response = await fetch(`http://localhost:3100/api/v1/roles/${id}`);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Rol no encontrado');
            }

            return response.json();
        },
        enabled: Boolean(id),
    });

    const updateMutation = useMutation<Role, Error, RoleInput>({
        mutationFn: async (updatedRole: RoleInput): Promise<Role> => {
            const response = await fetch(`http://localhost:3100/api/v1/roles/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedRole),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    Array.isArray(errorData.message)
                        ? errorData.message.join(', ')
                        : errorData.message || 'Error al actualizar el rol'
                );
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['roles'] });
            navigate(`/roles/${id}`);
        },
    });

    const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const updatedRole: RoleInput = {
            name: String(formData.get('name') ?? ''),
        };

        updateMutation.mutate(updatedRole);
    };

    if (isLoading) return <p>Cargando datos del rol...</p>;
    if (isError || !role) return <h3>Error: {error?.message}</h3>;

    return (
        <section>
            <h1>Editar Rol #{role.role_id}</h1>

            {updateMutation.isError && (
                <h3 style={{ color: 'red' }}>Error al actualizar: {updateMutation.error?.message}</h3>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label htmlFor="name">Nombre del rol:</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    maxLength={100}
                    defaultValue={role.name}
                    required
                />

                <button type="submit" disabled={updateMutation.isPending} style={{ marginTop: '20px' }}>
                    {updateMutation.isPending ? 'Guardando...' : 'Actualizar rol'}
                </button>
            </form>

            <br />
            <Link to={`/roles/${role.role_id}`}>← Cancelar y volver</Link>
        </section>
    );
}