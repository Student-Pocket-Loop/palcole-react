import { Link } from 'react-router-dom';
import UserForm from '../../components/users/UserForm';

export default function InsertUserPage() {
    return (
        <section>
            <h1>Insertar Usuario</h1>
            <UserForm />
            <br />
            <Link to="/users">← Volver al listado</Link>
        </section>
    );
}
