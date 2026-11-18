import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import type { Message } from '../../types/Message';
import { MessageCard } from '../../components/messages/MessageCard';
import messagesMock from '../../data/messages.json';

const API_URL = import.meta.env.VITE_PALCOLE_BACKEND;

export default function AllMessagesPage() {
    const { data: messages, isLoading, isError, error } = useQuery<Message[], Error>({
        queryKey: ['messages'],
        queryFn: async (): Promise<Message[]> => {
            try {
                const response = await fetch(`${API_URL}/messages/`);

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || 'Error al obtener los mensajes');
                }

                return await response.json();
            } catch {
                console.warn('Backend no disponible, cargando datos mock de messages.json');
                return messagesMock as Message[];
            }
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
