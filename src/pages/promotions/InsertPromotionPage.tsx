import { Link } from 'react-router-dom';
import PromotionForm from '../../components/promotions/PromotionForm';

export default function InsertPromotionPage() {
    return (
        <section>
            <h1>Insertar Promoción</h1>
            <PromotionForm />
            <br />
            <Link to="/promotions">← Volver al listado</Link>
        </section>
    );
}