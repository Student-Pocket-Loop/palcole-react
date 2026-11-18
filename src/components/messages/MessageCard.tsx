import { Link } from "react-router-dom";
import type { Message } from "../../types/Message";

interface MessageCardProps {
    message: Message;
}

export function MessageCard({ message }: MessageCardProps) {
    return (
        <article className="entity-card">
            <div className="card-header">
                <h3 className="card-title">Mensaje</h3>
                <span className="card-badge">#{message.message_id}</span>
            </div>

            <div className="card-body">
                <p>
                    <strong>Conversación ID:</strong> {message.conversation_id} | <strong>Remitente (Sender ID):</strong> {message.sender_id}
                </p>
                <p>
                    <strong>Contenido:</strong> {message.content}
                </p>
                <p>
                    <strong>Enviado el:</strong> {message.sent_at}
                </p>
            </div>

            <div className="card-actions">
                <Link to={`/messages/${message.message_id}`} className="card-link">
                    Ver detalle
                </Link>
                <Link to={`/messages/edit/${message.message_id}`} className="card-link">
                    Editar
                </Link>
            </div>
        </article>
    );
}
