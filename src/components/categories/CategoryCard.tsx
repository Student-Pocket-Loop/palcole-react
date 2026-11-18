import { Link } from "react-router-dom";
import type { Category } from "../../types/Category";

interface CategoryCardProps {
    category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
    return (
        <article style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
            <h3>
                #{category.category_id} — {category.name}
            </h3>

            <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.75rem" }}>
                <Link to={`/categories/${category.category_id}`}>Ver detalle</Link>
                <Link to={`/categories/edit/${category.category_id}`}>Editar</Link>
            </div>
        </article>
    );
}