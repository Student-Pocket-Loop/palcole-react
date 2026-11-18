import { Link } from 'react-router-dom';
import PromotionForm from '../../components/promotions/PromotionForm';

export default function InsertPromotionPage() {
    return (
        <section className="form-page">
            <h1>Insertar Promoción</h1>
            <PromotionForm />
            <Link to="/promotions" className="form-back-link">← Volver al listado</Link>
        </section>
    );
}
