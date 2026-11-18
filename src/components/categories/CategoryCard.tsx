import { Link } from "react-router-dom";
import type { Category } from "../../types/Category";

interface CategoryCardProps {
    category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
    return (
        <article className="entity-card">
            <div className="card-header">
                <h3 className="card-title">{category.name}</h3>
                <span className="card-badge">#{category.category_id}</span>
            </div>

            <div className="card-actions">
                <Link to={`/categories/${category.category_id}`} className="card-link">
                    Ver detalle
                </Link>
                <Link to={`/categories/edit/${category.category_id}`} className="card-link">
                    Editar
                </Link>
            </div>
        </article>
    );
}
