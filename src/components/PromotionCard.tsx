import { Link } from "react-router-dom";
import type { Promotion } from "../types/Promotion";

interface PromotionCardProps {
    promotion: Promotion;
}

export function PromotionCard({ promotion }: PromotionCardProps) {
    return (
        <article style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
            <h3>
                #{promotion.promotion_id} — {promotion.title}
            </h3>
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

            <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.75rem" }}>
                <Link to={`/promotions/${promotion.promotion_id}`}>Ver detalle</Link>
                <Link to={`/promotions/edit/${promotion.promotion_id}`}>Editar</Link>
            </div>
        </article>
    );
}