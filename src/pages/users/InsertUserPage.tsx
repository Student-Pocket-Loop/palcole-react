import { Link } from 'react-router-dom';
import UserForm from '../../components/users/UserForm';

export default function InsertUserPage() {
    return (
        <section className="form-page">
            <h1>Insertar Usuario</h1>
            <UserForm />
            <Link to="/users" className="form-back-link">← Volver al listado</Link>
        </section>
    );
}
