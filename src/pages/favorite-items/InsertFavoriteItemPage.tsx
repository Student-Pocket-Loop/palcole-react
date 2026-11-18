import { Link } from 'react-router-dom';
import FavoriteItemForm from '../../components/favorite-items/FavoriteItemForm';

export default function InsertFavoriteItemPage() {
    return (
        <section className="form-page">
            <h1>Añadir Item a Favoritos</h1>
            <FavoriteItemForm />
            <Link to="/favorite-items" className="form-back-link">← Volver al listado</Link>
        </section>
    );
}
