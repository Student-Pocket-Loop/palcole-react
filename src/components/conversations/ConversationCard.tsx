import { Link } from "react-router-dom";
import type { Conversation } from "../../types/Conversation";

interface ConversationCardProps {
    conversation: Conversation;
}

export function ConversationCard({ conversation }: ConversationCardProps) {
    return (
        <article style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
            <h3>
                Conversación #{conversation.conversation_id}
            </h3>
            <p>
                <strong>Item ID:</strong> {conversation.item_id} | <strong>Comprador (Buyer ID):</strong> {conversation.buyer_id}
            </p>
            <p>
                <strong>Iniciada el:</strong> {conversation.started_at}
            </p>

            <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.75rem" }}>
                <Link to={`/conversations/${conversation.conversation_id}`}>Ver detalle</Link>
                <Link to={`/conversations/edit/${conversation.conversation_id}`}>Editar</Link>
            </div>
        </article>
    );
}
