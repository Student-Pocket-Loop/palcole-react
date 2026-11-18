import { Link } from 'react-router-dom';
import FavoriteItemForm from '../../components/favorite-items/FavoriteItemForm';

export default function InsertFavoriteItemPage() {
    return (
        <section>
            <h1>Añadir Item a Favoritos</h1>
            <FavoriteItemForm />
            <br />
            <Link to="/favorite-items">← Volver al listado</Link>
        </section>
    );
}