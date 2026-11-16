import { Link } from 'react-router-dom';
import InsertUserForm from '../components/UserForm';

export default function InsertUserPage() {
    return (
        <section>
            <h1>Insertar Usuario</h1>
            <InsertUserForm />
            <br />
            <Link to="/users">← Volver al listado</Link>
        </section>
    );
}
