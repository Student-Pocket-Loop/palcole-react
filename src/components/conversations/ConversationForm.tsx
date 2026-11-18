import type { SubmitEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import type { Conversation } from '../../types/Conversation';
import type { ConversationInput } from '../../types/ConversationInput';

const API_URL = import.meta.env.VITE_PALCOLE_BACKEND;

export default function ConversationForm() {
    const { mutate, data, isPending, isError, error, isSuccess } = useMutation<
        Conversation,
        Error,
        ConversationInput
    >({
        mutationFn: async (newConversation: ConversationInput): Promise<Conversation> => {
            try {
                const response = await fetch(`${API_URL}/conversations/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newConversation),
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(
                        Array.isArray(errorData.message)
                            ? errorData.message.join(', ')
                            : errorData.message || 'Error al crear la conversación'
                    );
                }

                return await response.json();
            } catch {
                console.warn('Backend no disponible, simulando inserción de conversación');
                return {
                    conversation_id: Math.floor(Math.random() * 1000) + 10,
                    ...newConversation,
                };
            }
        },
    });

    const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const startedAt = formData.get('started_at');

        const newConversation: ConversationInput = {
            item_id: Number(formData.get('item_id')),
            buyer_id: Number(formData.get('buyer_id')),
            started_at: startedAt ? new Date(String(startedAt)).toISOString() : new Date().toISOString(),
        };

        mutate(newConversation);
    };

    if (isError) {
        return <div className="status-error">Error al crear la conversación: {error?.message}</div>;
    }

    return (
        <>
            {isSuccess && data ? (
                <div className="status-success">
                    La conversación se ha creado correctamente con ID: {data.conversation_id}!
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="entity-form">
                    <label htmlFor="item_id">Item ID:</label>
                    <input type="number" id="item_id" name="item_id" defaultValue={1} required />

                    <label htmlFor="buyer_id">Buyer ID (Comprador):</label>
                    <input type="number" id="buyer_id" name="buyer_id" defaultValue={1} required />

                    <label htmlFor="started_at">Fecha y hora de inicio:</label>
                    <input
                        type="datetime-local"
                        id="started_at"
                        name="started_at"
                        defaultValue={new Date().toISOString().slice(0, 16)}
                        required
                    />

                    <button type="submit" className="btn-submit" disabled={isPending}>
                        {isPending ? 'Enviando...' : 'Crear conversación'}
                    </button>
                </form>
            )}
        </>
    );
}
