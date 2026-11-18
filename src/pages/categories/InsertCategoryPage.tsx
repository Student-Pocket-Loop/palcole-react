import { Link } from 'react-router-dom';
import CategoryForm from '../../components/categories/CategoryForm';

export default function InsertCategoryPage() {
    return (
        <section className="form-page">
            <h1>Insertar Categoría</h1>
            <CategoryForm />
            <Link to="/categories" className="form-back-link">← Volver al listado</Link>
        </section>
    );
}
