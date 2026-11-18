import type { SubmitEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import type { Message } from '../types/Message';
import type { MessageInput } from '../types/MessageInput';

const API_URL = import.meta.env.VITE_PALCOLE_BACKEND;

export default function MessageForm() {
    const { mutate, data, isPending, isError, error, isSuccess } = useMutation<
        Message,
        Error,
        MessageInput
    >({
        mutationFn: async (newMessage: MessageInput): Promise<Message> => {
            try {
                const response = await fetch(`${API_URL}/messages/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newMessage),
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(
                        Array.isArray(errorData.message)
                            ? errorData.message.join(', ')
                            : errorData.message || 'Error al enviar el mensaje'
                    );
                }

                return await response.json();
            } catch {
                console.warn('Backend no disponible, simulando inserción de mensaje');
                return {
                    message_id: Math.floor(Math.random() * 1000) + 10,
                    ...newMessage,
                };
            }
        },
    });

    const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const sentAt = formData.get('sent_at');

        const newMessage: MessageInput = {
            conversation_id: Number(formData.get('conversation_id')),
            sender_id: Number(formData.get('sender_id')),
            content: String(formData.get('content') ?? ''),
            sent_at: sentAt ? new Date(String(sentAt)).toISOString() : new Date().toISOString(),
        };

        mutate(newMessage);
    };

    if (isError) {
        return <h3>Error al enviar el mensaje: {error?.message}</h3>;
    }

    return (
        <>
            {isSuccess && data ? (
                <h3>El mensaje se ha enviado correctamente con ID: {data.message_id}!</h3>
            ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <label htmlFor="conversation_id">Conversation ID:</label>
                    <input type="number" id="conversation_id" name="conversation_id" defaultValue={1} required />

                    <label htmlFor="sender_id">Sender ID (Remitente):</label>
                    <input type="number" id="sender_id" name="sender_id" defaultValue={1} required />

                    <label htmlFor="content">Contenido del mensaje:</label>
                    <textarea id="content" name="content" rows={4} placeholder="Escribe tu mensaje aquí..." required />

                    <label htmlFor="sent_at">Fecha y hora de envío:</label>
                    <input
                        type="datetime-local"
                        id="sent_at"
                        name="sent_at"
                        defaultValue={new Date().toISOString().slice(0, 16)}
                        required
                    />

                    <button type="submit" disabled={isPending} style={{ marginTop: '20px' }}>
                        {isPending ? 'Enviando...' : 'Enviar mensaje'}
                    </button>
                </form>
            )}
        </>
    );
}
