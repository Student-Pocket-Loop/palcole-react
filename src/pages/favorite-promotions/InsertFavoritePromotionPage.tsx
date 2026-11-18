import { Link } from 'react-router-dom';
import FavoritePromotionForm from '../../components/favorite-promotions/FavoritePromotionForm';

export default function InsertFavoritePromotionPage() {
    return (
        <section className="form-page">
            <h1>Añadir Promoción a Favoritos</h1>
            <FavoritePromotionForm />
            <Link to="/favorite-promotions" className="form-back-link">← Volver al listado</Link>
        </section>
    );
}
