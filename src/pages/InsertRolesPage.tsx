import { Link } from 'react-router-dom';
import InsertRoleForm from '../components/RoleForm';

export default function InsertRolePage() {
    return (
        <section>
            <h1>Insertar Rol</h1>
            <InsertRoleForm />
            <br />
            <Link to="/roles">← Volver al listado</Link>
        </section>
    );
}