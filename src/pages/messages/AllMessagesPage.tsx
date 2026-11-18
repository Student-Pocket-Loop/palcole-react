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

    if (isLoading) return <p className="status-loading">Cargando mensajes...</p>;
    if (isError) return <div className="status-error">Error: {error?.message}</div>;

    return (
        <section className="list-page">
            <div className="list-header">
                <h1>Listado de Mensajes</h1>
                <Link to="/messages/new" className="btn-create">+ Nuevo mensaje</Link>
            </div>

            {messages && messages.length === 0 ? (
                <p className="empty-state">No hay mensajes disponibles.</p>
            ) : (
                <div className="cards-grid">
                    {messages?.map((message) => (
                        <MessageCard key={message.message_id} message={message} />
                    ))}
                </div>
            )}
        </section>
    );
}
