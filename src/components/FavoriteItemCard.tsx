import { Link } from "react-router-dom";
import type { FavoriteItem } from "../types/FavoriteItem";

interface FavoriteItemCardProps {
    favoriteItem: FavoriteItem;
}

export function FavoriteItemCard({ favoriteItem }: FavoriteItemCardProps) {
    return (
        <article style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
            <h3>
                Favorito: Usuario #{favoriteItem.user_id} — Item #{favoriteItem.item_id}
            </h3>
            <p>
                <strong>User ID:</strong> {favoriteItem.user_id} | <strong>Item ID:</strong> {favoriteItem.item_id}
            </p>

            <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.75rem" }}>
                <Link to={`/favorite-items/${favoriteItem.user_id}/${favoriteItem.item_id}`}>Ver detalle</Link>
                <Link to={`/favorite-items/edit/${favoriteItem.user_id}/${favoriteItem.item_id}`}>Editar</Link>
            </div>
        </article>
    );
}