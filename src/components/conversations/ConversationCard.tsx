import { Link } from "react-router-dom";
import type { Conversation } from "../../types/Conversation";

interface ConversationCardProps {
    conversation: Conversation;
}

export function ConversationCard({ conversation }: ConversationCardProps) {
    return (
        <article className="entity-card">
            <div className="card-header">
                <h3 className="card-title">Conversación</h3>
                <span className="card-badge">#{conversation.conversation_id}</span>
            </div>

            <div className="card-body">
                <p>
                    <strong>Item ID:</strong> {conversation.item_id} | <strong>Comprador (Buyer ID):</strong> {conversation.buyer_id}
                </p>
                <p>
                    <strong>Iniciada el:</strong> {conversation.started_at}
                </p>
            </div>

            <div className="card-actions">
                <Link to={`/conversations/${conversation.conversation_id}`} className="card-link">
                    Ver detalle
                </Link>
                <Link to={`/conversations/edit/${conversation.conversation_id}`} className="card-link">
                    Editar
                </Link>
            </div>
        </article>
    );
}
