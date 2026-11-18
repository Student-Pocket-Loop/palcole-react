import { Link } from 'react-router-dom';
import RoleForm from '../../components/roles/RoleForm';

export default function InsertRolePage() {
    return (
        <section>
            <h1>Insertar Rol</h1>
            <RoleForm />
            <br />
            <Link to="/roles">← Volver al listado</Link>
        </section>
    );
}