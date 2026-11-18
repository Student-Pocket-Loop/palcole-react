import { Link } from "react-router-dom";
import type { AcademicItem } from "../../types/AcademicItem";

interface AcademicItemCardProps {
    item: AcademicItem;
}

export function AcademicItemCard({ item }: AcademicItemCardProps) {
    return (
        <article style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
            <h3>
                #{item.item_id} — {item.title}
            </h3>
            <p>
                <strong>Precio:</strong> {item.price} € | <strong>Estado:</strong> {item.sale_status}
            </p>
            <p>
                <strong>Condición:</strong> {item.item_condition} | <strong>Tipo:</strong> {item.listing_type}
            </p>
            <p>
                <strong>Estudiante ID:</strong> {item.student_id} | <strong>Categoría ID:</strong> {item.category_id}
            </p>

            <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.75rem" }}>
                <Link to={`/academic-items/${item.item_id}`}>Ver detalle</Link>
                <Link to={`/academic-items/edit/${item.item_id}`}>Editar</Link>
            </div>
        </article>
    );
}