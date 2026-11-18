import { Link } from 'react-router-dom';
import AcademicItemForm from '../../components/academic-items/AcademicItemForm';

export default function InsertAcademicItemPage() {
    return (
        <section>
            <h1>Insertar Recurso Académico</h1>
            <AcademicItemForm />
            <br />
            <Link to="/academic-items">← Volver al listado</Link>
        </section>
    );
}
