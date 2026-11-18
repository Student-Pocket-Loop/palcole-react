import { Link } from "react-router-dom";
import type { Role } from "../../types/Role";

interface RoleCardProps {
    role: Role;
}

export function RoleCard({ role }: RoleCardProps) {
    return (
        <article className="entity-card">
            <div className="card-header">
                <h3 className="card-title">{role.name}</h3>
                <span className="card-badge">#{role.role_id}</span>
            </div>

            <div className="card-actions">
                <Link to={`/roles/${role.role_id}`} className="card-link">
                    Ver detalle
                </Link>
                <Link to={`/roles/edit/${role.role_id}`} className="card-link">
                    Editar
                </Link>
            </div>
        </article>
    );
}
