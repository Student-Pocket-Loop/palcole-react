import { Link } from 'react-router-dom';
import AcademicItemForm from '../../components/academic-items/AcademicItemForm';

export default function InsertAcademicItemPage() {
    return (
        <section className="form-page">
            <h1>Insertar Recurso Académico</h1>
            <AcademicItemForm />
            <Link to="/academic-items" className="form-back-link">← Volver al listado</Link>
        </section>
    );
}
