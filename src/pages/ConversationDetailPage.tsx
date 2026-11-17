import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Conversation } from '../types/Conversation';

export default function ConversationDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: conversation, isLoading, isError, error } = useQuery<Conversation, Error>({
        queryKey: ['conversations', id],
        queryFn: async (): Promise<Conversation> => {
            const response = await fetch(`http://localhost:3100/api/v1/conversations/${id}`);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Conversación no encontrada');
            }

            return response.json();
        },
        enabled: Boolean(id),
    });

    const deleteMutation = useMutation<void, Error>({
        mutationFn: async (): Promise<void> => {
            const response = await fetch(`http://localhost:3100/api/v1/conversations/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error al eliminar la conversación');
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
            navigate('/conversations');
        },
    });

    if (isLoading) return <p>Cargando detalle de la conversación...</p>;
    if (isError || !conversation) return <h3>Error: {error?.message}</h3>;

    return (
        <section>
            <h1>Detalle de la Conversación #{conversation.conversation_id}</h1>

            <ul>
                <li><strong>ID:</strong> {conversation.conversation_id}</li>
                <li><strong>Item ID:</strong> {conversation.item_id}</li>
                <li><strong>Buyer ID:</strong> {conversation.buyer_id}</li>
                <li><strong>Iniciada el:</strong> {conversation.started_at}</li>
            </ul>

            {deleteMutation.isError && (
                <p style={{ color: 'red' }}>Error al eliminar: {deleteMutation.error?.message}</p>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <Link to="/conversations">← Volver</Link>
                <Link to={`/conversations/edit/${conversation.conversation_id}`}>Editar</Link>
                <button
                    type="button"
                    disabled={deleteMutation.isPending}
                    onClick={() => {
                        if (confirm(`¿Seguro que quieres eliminar la conversación #${conversation.conversation_id}?`)) {
                            deleteMutation.mutate();
                        }
                    }}
                >
                    {deleteMutation.isPending ? 'Eliminando...' : 'Eliminar conversación'}
                </button>
            </div>
        </section>
    );
}