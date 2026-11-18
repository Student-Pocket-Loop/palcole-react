import { Link } from "react-router-dom";
import type { FavoritePromotion } from "../../types/FavoritePromotion";

interface FavoritePromotionCardProps {
    favoritePromotion: FavoritePromotion;
}

export function FavoritePromotionCard({ favoritePromotion }: FavoritePromotionCardProps) {
    return (
        <article style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
            <h3>
                Favorito: Usuario #{favoritePromotion.user_id} — Promoción #{favoritePromotion.promotion_id}
            </h3>
            <p>
                <strong>User ID:</strong> {favoritePromotion.user_id} | <strong>Promotion ID:</strong> {favoritePromotion.promotion_id}
            </p>

            <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.75rem" }}>
                <Link to={`/favorite-promotions/${favoritePromotion.user_id}/${favoritePromotion.promotion_id}`}>Ver detalle</Link>
                <Link to={`/favorite-promotions/edit/${favoritePromotion.user_id}/${favoritePromotion.promotion_id}`}>Editar</Link>
            </div>
        </article>
    );
}