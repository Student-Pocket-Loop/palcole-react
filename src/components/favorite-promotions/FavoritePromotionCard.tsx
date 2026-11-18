import { Link } from "react-router-dom";
import type { FavoritePromotion } from "../../types/FavoritePromotion";

interface FavoritePromotionCardProps {
    favoritePromotion: FavoritePromotion;
}

export function FavoritePromotionCard({ favoritePromotion }: FavoritePromotionCardProps) {
    return (
        <article className="entity-card">
            <div className="card-header">
                <h3 className="card-title">Promoción Favorita</h3>
                <span className="card-badge">
                    #{favoritePromotion.user_id} · #{favoritePromotion.promotion_id}
                </span>
            </div>

            <div className="card-body">
                <p>
                    <strong>User ID:</strong> {favoritePromotion.user_id} | <strong>Promotion ID:</strong> {favoritePromotion.promotion_id}
                </p>
            </div>

            <div className="card-actions">
                <Link
                    to={`/favorite-promotions/${favoritePromotion.user_id}/${favoritePromotion.promotion_id}`}
                    className="card-link"
                >
                    Ver detalle
                </Link>
                <Link
                    to={`/favorite-promotions/edit/${favoritePromotion.user_id}/${favoritePromotion.promotion_id}`}
                    className="card-link"
                >
                    Editar
                </Link>
            </div>
        </article>
    );
}
