import { Link } from "react-router-dom";
import type { User } from "../../types/User";

interface UserCardProps {
    user: User;
}

export function UserCard({ user }: UserCardProps) {
    return (
        <article className="entity-card">
            <div className="card-header">
                <h3 className="card-title">{user.username}</h3>
                <span className="card-badge">#{user.user_id}</span>
            </div>

            <div className="card-body">
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
            </div>

            <div className="card-actions">
                <Link to={`/users/${user.user_id}`} className="card-link">
                    Ver detalle
                </Link>
                <Link to={`/users/edit/${user.user_id}`} className="card-link">
                    Editar
                </Link>
            </div>
        </article>
    );
}
