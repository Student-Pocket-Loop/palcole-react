import { Link } from 'react-router-dom';
import RoleForm from '../../components/roles/RoleForm';

export default function InsertRolePage() {
    return (
        <section className="form-page">
            <h1>Insertar Rol</h1>
            <RoleForm />
            <Link to="/roles" className="form-back-link">← Volver al listado</Link>
        </section>
    );
}
