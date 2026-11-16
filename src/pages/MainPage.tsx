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
    { title: "Categories", description: "Categorías para organizar los recursos", path: "/categories", group: "Usuarios" },
    { title: "Academic Items", description: "Apuntes, materiales y recursos académicos", path: "/academic-items", group: "Catálogo" },
    { title: "Promotions", description: "Descuentos y promociones activas", path: "/promotions", group: "Catálogo" },
    { title: "Favorite Items", description: "Recursos guardados como favoritos", path: "/favorite-items", group: "Catálogo" },
    { title: "Favorite Promotions", description: "Promociones marcadas como favoritas", path: "/favorite-promotions", group: "Interacción" },
    { title: "Conversations", description: "Hilos de chat entre usuarios", path: "/conversations", group: "Interacción" },
    { title: "Messages", description: "Historial de mensajes enviados", path: "/messages", group: "Interacción" },
];

export default function MainPage() {
  return (
        <section>
            <h1>Panel de Gestión</h1>
            <p>Selecciona una entidad para administrar sus registros:</p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
                {ENTITIES.map((entity) => (
                <article key={entity.path} style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
                    <small>{entity.group}</small>
                    <h2>{entity.title}</h2>
                    <p>{entity.description}</p>
                    <Link to={entity.path}>Gestionar →</Link>
                </article>
                ))}
            </div>
        </section>
  );
}