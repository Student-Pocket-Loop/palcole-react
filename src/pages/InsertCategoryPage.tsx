import { Link } from 'react-router-dom';
import InsertCategoryForm from '../components/CategoryForm';

export default function InsertCategoryPage() {
    return (
        <section>
            <h1>Insertar Categoría</h1>
            <InsertCategoryForm />
            <br />
            <Link to="/categories">← Volver al listado</Link>
        </section>
    );
}
