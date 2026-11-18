import { Link } from "react-router-dom";
import type { Message } from "../types/Message";

interface MessageCardProps {
    message: Message;
}

export function MessageCard({ message }: MessageCardProps) {
    return (
        <article style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
            <h3>
                Mensaje #{message.message_id}
            </h3>
            <p>
                <strong>Conversación ID:</strong> {message.conversation_id} | <strong>Remitente (Sender ID):</strong> {message.sender_id}
            </p>
            <p>
                <strong>Contenido:</strong> {message.content}
            </p>
            <p>
                <strong>Enviado el:</strong> {message.sent_at}
            </p>

            <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.75rem" }}>
                <Link to={`/messages/${message.message_id}`}>Ver detalle</Link>
                <Link to={`/messages/edit/${message.message_id}`}>Editar</Link>
            </div>
        </article>
    );
}
