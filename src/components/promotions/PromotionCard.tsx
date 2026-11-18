import { Link } from "react-router-dom";
import type { Promotion } from "../../types/Promotion";

interface PromotionCardProps {
    promotion: Promotion;
}

export function PromotionCard({ promotion }: PromotionCardProps) {
    return (
        <article className="entity-card">
            <div className="card-header">
                <h3 className="card-title">{promotion.title}</h3>
                <span className="card-badge">#{promotion.promotion_id}</span>
            </div>

            <div className="card-body">
                <p>
                    <strong>Precio original:</strong> <s>{promotion.original_price} €</s> |{" "}
                    <strong>Oferta:</strong> {promotion.discount_price} € (-{promotion.discount_percentage}%)
                </p>
                <p>
                    <strong>Código:</strong> {promotion.promo_code} | <strong>Categoría ID:</strong> {promotion.category_id}
                </p>
                <p>
                    <strong>Validez:</strong> {promotion.start_date?.split("T")[0]} al {promotion.end_date?.split("T")[0]}
                </p>
            </div>

            <div className="card-actions">
                <Link to={`/promotions/${promotion.promotion_id}`} className="card-link">
                    Ver detalle
                </Link>
                <Link to={`/promotions/edit/${promotion.promotion_id}`} className="card-link">
                    Editar
                </Link>
            </div>
        </article>
    );
}
