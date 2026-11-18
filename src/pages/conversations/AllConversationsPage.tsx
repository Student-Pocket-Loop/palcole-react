import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import type { Conversation } from '../../types/Conversation';
import { ConversationCard } from '../../components/conversations/ConversationCard';
import conversationsMock from '../../data/conversations.json';

const API_URL = import.meta.env.VITE_PALCOLE_BACKEND;

export default function AllConversationsPage() {
    const { data: conversations, isLoading, isError, error } = useQuery<Conversation[], Error>({
        queryKey: ['conversations'],
        queryFn: async (): Promise<Conversation[]> => {
            try {
                const response = await fetch(`${API_URL}/conversations/`);

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || 'Error al obtener las conversaciones');
                }

                return await response.json();
            } catch {
                console.warn('Backend no disponible, cargando datos mock de conversations.json');
                return conversationsMock as Conversation[];
            }
        },
    });

    if (isLoading) return <p className="status-loading">Cargando conversaciones...</p>;
    if (isError) return <div className="status-error">Error: {error?.message}</div>;

    return (
        <section className="list-page">
            <div className="list-header">
                <h1>Listado de Conversaciones</h1>
                <Link to="/conversations/new" className="btn-create">+ Nueva conversación</Link>
            </div>

            {conversations && conversations.length === 0 ? (
                <p className="empty-state">No hay conversaciones disponibles.</p>
            ) : (
                <div className="cards-grid">
                    {conversations?.map((conversation) => (
                        <ConversationCard key={conversation.conversation_id} conversation={conversation} />
                    ))}
                </div>
            )}
        </section>
    );
}
