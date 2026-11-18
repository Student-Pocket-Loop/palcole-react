import { Link } from "react-router-dom";
import type { AcademicItem } from "../../types/AcademicItem";

interface AcademicItemCardProps {
    item: AcademicItem;
}

export function AcademicItemCard({ item }: AcademicItemCardProps) {
    return (
        <article className="entity-card">
            <div className="card-header">
                <h3 className="card-title">{item.title}</h3>
                <span className="card-badge">#{item.item_id}</span>
            </div>

            <div className="card-body">
                <p>
                    <strong>Precio:</strong> {item.price} € | <strong>Estado:</strong> {item.sale_status}
                </p>
                <p>
                    <strong>Condición:</strong> {item.item_condition} | <strong>Tipo:</strong> {item.listing_type}
                </p>
                <p>
                    <strong>Estudiante ID:</strong> {item.student_id} | <strong>Categoría ID:</strong> {item.category_id}
                </p>
            </div>

            <div className="card-actions">
                <Link to={`/academic-items/${item.item_id}`} className="card-link">
                    Ver detalle
                </Link>
                <Link to={`/academic-items/edit/${item.item_id}`} className="card-link">
                    Editar
                </Link>
            </div>
        </article>
    );
}