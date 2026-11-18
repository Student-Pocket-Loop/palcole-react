import type { SubmitEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Role } from '../../types/Role';
import type { RoleInput } from '../../types/RoleInput';
import rolesMock from '../../data/roles.json';

const API_URL = import.meta.env.VITE_PALCOLE_BACKEND;

export default function UpdateRolePage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: role, isLoading, isError, error } = useQuery<Role, Error>({
        queryKey: ['roles', id],
        queryFn: async (): Promise<Role> => {
            try {
                const response = await fetch(`${API_URL}/roles/${id}`);

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || 'Rol no encontrado');
                }

                return await response.json();
            } catch {
                console.warn('Backend no disponible, cargando rol de roles.json para editar');
                const found = (rolesMock as Role[]).find((r) => r.role_id === Number(id));
                if (!found) {
                    throw new Error('Rol no encontrado en datos mock');
                }
                return found;
            }
        },
        enabled: Boolean(id),
    });

    const updateMutation = useMutation<Role, Error, RoleInput>({
        mutationFn: async (updatedRole: RoleInput): Promise<Role> => {
            try {
                const response = await fetch(`${API_URL}/roles/${id}`, {
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

                return await response.json();
            } catch {
                console.warn('Backend no disponible, simulando actualización de rol');
                return {
                    role_id: Number(id),
                    ...updatedRole,
                };
            }
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

    if (isLoading) return <p className="status-loading">Cargando datos del rol...</p>;
    if (isError || !role) return <div className="status-error">Error: {error?.message}</div>;

    return (
        <section className="form-page">
            <h1>Editar Rol #{role.role_id}</h1>

            {updateMutation.isError && (
                <div className="status-error">Error al actualizar: {updateMutation.error?.message}</div>
            )}

            <form onSubmit={handleSubmit} className="entity-form">
                <label htmlFor="name">Nombre del rol:</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    maxLength={100}
                    defaultValue={role.name}
                    required
                />

                <button type="submit" className="btn-submit" disabled={updateMutation.isPending}>
                    {updateMutation.isPending ? 'Guardando...' : 'Actualizar rol'}
                </button>
            </form>

            <Link to={`/roles/${role.role_id}`} className="form-back-link">
                ← Cancelar y volver
            </Link>
        </section>
    );
}
