import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Conversation } from '../../types/Conversation';
import conversationsMock from '../../data/conversations.json';

const API_URL = import.meta.env.VITE_PALCOLE_BACKEND;

export default function ConversationDetailPage() {
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
                console.warn('Backend no disponible, buscando conversación en conversations.json');
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

    const deleteMutation = useMutation<void, Error>({
        mutationFn: async (): Promise<void> => {
            try {
                const response = await fetch(`${API_URL}/conversations/${id}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || 'Error al eliminar la conversación');
                }
            } catch {
                console.warn('Backend no disponible, simulando borrado de conversación');
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
            navigate('/conversations');
        },
    });

    if (isLoading) return <p className="status-loading">Cargando detalle de la conversación...</p>;
    if (isError || !conversation) return <div className="status-error">Error: {error?.message}</div>;

    return (
        <section className="detail-page">
            <h1>Detalle de la Conversación #{conversation.conversation_id}</h1>

            <ul className="detail-list">
                <li><strong>ID:</strong> {conversation.conversation_id}</li>
                <li><strong>Item ID:</strong> {conversation.item_id}</li>
                <li><strong>Buyer ID:</strong> {conversation.buyer_id}</li>
                <li><strong>Iniciada el:</strong> {conversation.started_at}</li>
            </ul>

            {deleteMutation.isError && (
                <div className="status-error">Error al eliminar: {deleteMutation.error?.message}</div>
            )}

            <div className="detail-actions">
                <Link to="/conversations" className="btn-back">← Volver</Link>
                <Link to={`/conversations/edit/${conversation.conversation_id}`} className="btn-edit">Editar</Link>
                <button
                    type="button"
                    className="btn-delete"
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
