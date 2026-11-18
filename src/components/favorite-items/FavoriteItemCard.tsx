import { Link } from "react-router-dom";
import type { FavoriteItem } from "../../types/FavoriteItem";

interface FavoriteItemCardProps {
    favoriteItem: FavoriteItem;
}

export function FavoriteItemCard({ favoriteItem }: FavoriteItemCardProps) {
    return (
        <article className="entity-card">
            <div className="card-header">
                <h3 className="card-title">Recurso Favorito</h3>
                <span className="card-badge">
                    #{favoriteItem.user_id} · #{favoriteItem.item_id}
                </span>
            </div>

            <div className="card-body">
                <p>
                    <strong>User ID:</strong> {favoriteItem.user_id} | <strong>Item ID:</strong> {favoriteItem.item_id}
                </p>
            </div>

            <div className="card-actions">
                <Link
                    to={`/favorite-items/${favoriteItem.user_id}/${favoriteItem.item_id}`}
                    className="card-link"
                >
                    Ver detalle
                </Link>
                <Link
                    to={`/favorite-items/edit/${favoriteItem.user_id}/${favoriteItem.item_id}`}
                    className="card-link"
                >
                    Editar
                </Link>
            </div>
        </article>
    );
}
