import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Message } from '../types/Message';

export default function MessageDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: message, isLoading, isError, error } = useQuery<Message, Error>({
        queryKey: ['messages', id],
        queryFn: async (): Promise<Message> => {
            const response = await fetch(`http://localhost:3100/api/v1/messages/${id}`);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Mensaje no encontrado');
            }

            return response.json();
        },
        enabled: Boolean(id),
    });

    const deleteMutation = useMutation<void, Error>({
        mutationFn: async (): Promise<void> => {
            const response = await fetch(`http://localhost:3100/api/v1/messages/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error al eliminar el mensaje');
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['messages'] });
            navigate('/messages');
        },
    });

    if (isLoading) return <p>Cargando detalle del mensaje...</p>;
    if (isError || !message) return <h3>Error: {error?.message}</h3>;

    return (
        <section>
            <h1>Detalle del Mensaje #{message.message_id}</h1>

            <ul>
                <li><strong>ID:</strong> {message.message_id}</li>
                <li><strong>Conversation ID:</strong> {message.conversation_id}</li>
                <li><strong>Sender ID:</strong> {message.sender_id}</li>
                <li><strong>Contenido:</strong> {message.content}</li>
                <li><strong>Enviado el:</strong> {message.sent_at}</li>
            </ul>

            {deleteMutation.isError && (
                <p style={{ color: 'red' }}>Error al eliminar: {deleteMutation.error?.message}</p>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <Link to="/messages">← Volver</Link>
                <Link to={`/messages/edit/${message.message_id}`}>Editar</Link>
                <button
                    type="button"
                    disabled={deleteMutation.isPending}
                    onClick={() => {
                        if (confirm(`¿Seguro que quieres eliminar el mensaje #${message.message_id}?`)) {
                            deleteMutation.mutate();
                        }
                    }}
                >
                    {deleteMutation.isPending ? 'Eliminando...' : 'Eliminar mensaje'}
                </button>
            </div>
        </section>
    );
}
