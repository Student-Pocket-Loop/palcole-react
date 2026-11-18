import type { SubmitEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Message } from '../types/Message';
import type { MessageInput } from '../types/MessageInput';
import messagesMock from '../data/messages.json';

const API_URL = import.meta.env.VITE_PALCOLE_BACKEND;

export default function UpdateMessagePage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: message, isLoading, isError, error } = useQuery<Message, Error>({
        queryKey: ['messages', id],
        queryFn: async (): Promise<Message> => {
            try {
                const response = await fetch(`${API_URL}/messages/${id}`);

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || 'Mensaje no encontrado');
                }

                return await response.json();
            } catch {
                console.warn('Backend no disponible, cargando mensaje de messages.json para editar');
                const found = (messagesMock as Message[]).find((m) => m.message_id === Number(id));
                if (!found) {
                    throw new Error('Mensaje no encontrado en datos mock');
                }
                return found;
            }
        },
        enabled: Boolean(id),
    });

    const updateMutation = useMutation<Message, Error, MessageInput>({
        mutationFn: async (updatedMessage: MessageInput): Promise<Message> => {
            try {
                const response = await fetch(`${API_URL}/messages/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedMessage),
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(
                        Array.isArray(errorData.message)
                            ? errorData.message.join(', ')
                            : errorData.message || 'Error al actualizar el mensaje'
                    );
                }

                return await response.json();
            } catch {
                console.warn('Backend no disponible, simulando actualización de mensaje');
                return {
                    message_id: Number(id),
                    ...updatedMessage,
                };
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['messages'] });
            navigate(`/messages/${id}`);
        },
    });

    const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const sentAt = formData.get('sent_at');

        const updatedMessage: MessageInput = {
            conversation_id: Number(formData.get('conversation_id')),
            sender_id: Number(formData.get('sender_id')),
            content: String(formData.get('content') ?? ''),
            sent_at: sentAt ? new Date(String(sentAt)).toISOString() : message!.sent_at,
        };

        updateMutation.mutate(updatedMessage);
    };

    if (isLoading) return <p>Cargando datos del mensaje...</p>;
    if (isError || !message) return <h3>Error: {error?.message}</h3>;

    return (
        <section>
            <h1>Editar Mensaje #{message.message_id}</h1>

            {updateMutation.isError && (
                <h3 style={{ color: 'red' }}>Error al actualizar: {updateMutation.error?.message}</h3>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label htmlFor="conversation_id">Conversation ID:</label>
                <input type="number" id="conversation_id" name="conversation_id" defaultValue={message.conversation_id} required />

                <label htmlFor="sender_id">Sender ID (Remitente):</label>
                <input type="number" id="sender_id" name="sender_id" defaultValue={message.sender_id} required />

                <label htmlFor="content">Contenido del mensaje:</label>
                <textarea id="content" name="content" rows={4} defaultValue={message.content} required />

                <label htmlFor="sent_at">Fecha y hora de envío:</label>
                <input
                    type="datetime-local"
                    id="sent_at"
                    name="sent_at"
                    defaultValue={message.sent_at ? message.sent_at.slice(0, 16) : ''}
                    required
                />

                <button type="submit" disabled={updateMutation.isPending} style={{ marginTop: '20px' }}>
                    {updateMutation.isPending ? 'Guardando...' : 'Actualizar mensaje'}
                </button>
            </form>

            <br />
            <Link to={`/messages/${message.message_id}`}>← Cancelar y volver</Link>
        </section>
    );
}
