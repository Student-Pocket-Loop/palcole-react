import type { SubmitEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Conversation } from '../types/Conversation';
import type { ConversationInput } from '../types/ConversationInput';
import conversationsMock from '../data/conversations.json';

const API_URL = import.meta.env.VITE_PALCOLE_BACKEND;

export default function UpdateConversationPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: conversation, isLoading, isError, error } = useQuery<Conversation, Error>({
        queryKey: ['conversations', id],
        queryFn: async (): Promise<Conversation> => {
            try {
                const response = await fetch(`${API_URL}/conversations/${id}`);

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || 'Conversación no encontrada');
                }

                return await response.json();
            } catch {
                console.warn('Backend no disponible, cargando conversación de conversations.json para editar');
                const found = (conversationsMock as Conversation[]).find(
                    (c) => c.conversation_id === Number(id)
                );
                if (!found) {
                    throw new Error('Conversación no encontrada en datos mock');
                }
                return found;
            }
        },
        enabled: Boolean(id),
    });

    const updateMutation = useMutation<Conversation, Error, ConversationInput>({
        mutationFn: async (updatedConversation: ConversationInput): Promise<Conversation> => {
            try {
                const response = await fetch(`${API_URL}/conversations/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedConversation),
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(
                        Array.isArray(errorData.message)
                            ? errorData.message.join(', ')
                            : errorData.message || 'Error al actualizar la conversación'
                    );
                }

                return await response.json();
            } catch {
                console.warn('Backend no disponible, simulando actualización de conversación');
                return {
                    conversation_id: Number(id),
                    ...updatedConversation,
                };
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
            navigate(`/conversations/${id}`);
        },
    });

    const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const startedAt = formData.get('started_at');

        const updatedConversation: ConversationInput = {
            item_id: Number(formData.get('item_id')),
            buyer_id: Number(formData.get('buyer_id')),
            started_at: startedAt ? new Date(String(startedAt)).toISOString() : conversation!.started_at,
        };

        updateMutation.mutate(updatedConversation);
    };

    if (isLoading) return <p>Cargando datos de la conversación...</p>;
    if (isError || !conversation) return <h3>Error: {error?.message}</h3>;

    return (
        <section>
            <h1>Editar Conversación #{conversation.conversation_id}</h1>

            {updateMutation.isError && (
                <h3 style={{ color: 'red' }}>Error al actualizar: {updateMutation.error?.message}</h3>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label htmlFor="item_id">Item ID:</label>
                <input type="number" id="item_id" name="item_id" defaultValue={conversation.item_id} required />

                <label htmlFor="buyer_id">Buyer ID (Comprador):</label>
                <input type="number" id="buyer_id" name="buyer_id" defaultValue={conversation.buyer_id} required />

                <label htmlFor="started_at">Fecha y hora de inicio:</label>
                <input
                    type="datetime-local"
                    id="started_at"
                    name="started_at"
                    defaultValue={conversation.started_at ? conversation.started_at.slice(0, 16) : ''}
                    required
                />

                <button type="submit" disabled={updateMutation.isPending} style={{ marginTop: '20px' }}>
                    {updateMutation.isPending ? 'Guardando...' : 'Actualizar conversación'}
                </button>
            </form>

            <br />
            <Link to={`/conversations/${conversation.conversation_id}`}>← Cancelar y volver</Link>
        </section>
    );
}
