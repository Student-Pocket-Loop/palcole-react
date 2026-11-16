import { Link } from "react-router-dom";
import type { User } from "../types/User";

interface UserCardProps {
    user: User;
    onDelete: (id: number) => void;
}

export function UserCard({ user, onDelete }: UserCardProps) {
    return (
        <article style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
            <h3>
                #{user.user_id} — {user.username}
            </h3>
            <p>
                <strong>Email:</strong> {user.email}
            </p>
            <p>
                <strong>Centro:</strong> {user.educational_center} | <strong>Rol:</strong> {user.role_id}
            </p>
            <p>
                <strong>Estado:</strong> {user.is_active ? "Activo" : "Inactivo"} |{" "}
                {user.is_verified ? "Verificado" : "No verificado"}
            </p>

            <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.75rem" }}>
                <Link to={`/users/${user.user_id}`}>Ver detalle</Link>
                <Link to={`/users/edit/${user.user_id}`}>Editar</Link>
                <button
                    type="button"
                    onClick={() => {
                        if (confirm(`¿Eliminar al usuario ${user.username}?`)) {
                        onDelete(user.user_id);
                        }
                    }}
                >
                    Eliminar
                </button>
            </div>
        </article>
    );
}
