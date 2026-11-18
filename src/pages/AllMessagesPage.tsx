import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import type { Message } from '../types/Message';
import { MessageCard } from '../components/MessageCard';

export default function AllMessagesPage() {
    const { data: messages, isLoading, isError, error } = useQuery<Message[], Error>({
        queryKey: ['messages'],
        queryFn: async (): Promise<Message[]> => {
            const response = await fetch('http://localhost:3100/api/v1/messages');

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error al obtener los mensajes');
            }

            return response.json();
        },
    });

    if (isLoading) return <p>Cargando mensajes...</p>;
    if (isError) return <h3>Error: {error?.message}</h3>;

    return (
        <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h1>Listado de Mensajes</h1>
                <Link to="/messages/new">+ Nuevo mensaje</Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                {messages?.map((message) => (
                    <MessageCard key={message.message_id} message={message} />
                ))}
            </div>
        </section>
    );
}
