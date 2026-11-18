import { Link } from "react-router-dom";

interface EntityCard {
    title: string;
    description: string;
    path: string;
    group: string;
}

const ENTITIES: EntityCard[] = [
    { title: "Users", description: "Gestión de cuentas y perfiles de usuario", path: "/users", group: "Usuarios" },
    { title: "Roles", description: "Administración de roles y permisos", path: "/roles", group: "Usuarios" },
    { title: "Categories", description: "Categorías para organizar los recursos", path: "/categories", group: "Catálogo" },
    { title: "Academic Items", description: "Apuntes, materiales y recursos académicos", path: "/academic-items", group: "Catálogo" },
    { title: "Promotions", description: "Descuentos y promociones activas", path: "/promotions", group: "Catálogo" },
    { title: "Favorite Items", description: "Recursos guardados como favoritos", path: "/favorite-items", group: "Favoritos" },
    { title: "Favorite Promotions", description: "Promociones marcadas como favoritas", path: "/favorite-promotions", group: "Favoritos" },
    { title: "Conversations", description: "Hilos de chat entre usuarios", path: "/conversations", group: "Mensajería" },
    { title: "Messages", description: "Historial de mensajes enviados", path: "/messages", group: "Mensajería" },
];

export default function MainPage() {
    return (
        <section className="main-page">
            <div className="entities-grid">
                {ENTITIES.map((entity) => (
                    <article key={entity.path} className="entity-tile">
                        <div>
                            <small className="card-badge">{entity.group}</small>
                            <h2 className="entity-tile-title">{entity.title}</h2>
                            <p className="entity-tile-desc">{entity.description}</p>
                        </div>
                        <Link to={entity.path} className="entity-tile-link">
                            Gestionar →
                        </Link>
                    </article>
                ))}
            </div>
        </section>
    );
}
