import { Link } from "react-router-dom";
import type { Role } from "../../types/Role";

interface RoleCardProps {
    role: Role;
}

export function RoleCard({ role }: RoleCardProps) {
    return (
        <article style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
            <h3>
                #{role.role_id} — {role.name}
            </h3>

            <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.75rem" }}>
                <Link to={`/roles/${role.role_id}`}>Ver detalle</Link>
                <Link to={`/roles/edit/${role.role_id}`}>Editar</Link>
            </div>
        </article>
    );
}
