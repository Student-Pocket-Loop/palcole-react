import { Link } from 'react-router-dom';
import FavoritePromotionForm from '../components/FavoritePromotionForm';

export default function InsertFavoritePromotionPage() {
    return (
        <section>
            <h1>Añadir Promoción a Favoritos</h1>
            <FavoritePromotionForm />
            <br />
            <Link to="/favorite-promotions">← Volver al listado</Link>
        </section>
    );
}