import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import type { Conversation } from '../types/Conversation';
import { ConversationCard } from '../components/ConversationCard';

export default function AllConversationsPage() {
    const { data: conversations, isLoading, isError, error } = useQuery<Conversation[], Error>({
        queryKey: ['conversations'],
        queryFn: async (): Promise<Conversation[]> => {
            const response = await fetch('http://localhost:3100/api/v1/conversations');

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error al obtener las conversaciones');
            }

            return response.json();
        },
    });

    if (isLoading) return <p>Cargando conversaciones...</p>;
    if (isError) return <h3>Error: {error?.message}</h3>;

    return (
        <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h1>Listado de Conversaciones</h1>
                <Link to="/conversations/new">+ Nueva conversación</Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                {conversations?.map((conversation) => (
                    <ConversationCard key={conversation.conversation_id} conversation={conversation} />
                ))}
            </div>
        </section>
    );
}