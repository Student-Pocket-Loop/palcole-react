import { Link } from 'react-router-dom';
import MessageForm from '../../components/messages/MessageForm';

export default function InsertMessagePage() {
    return (
        <section className="form-page">
            <h1>Enviar Mensaje</h1>
            <MessageForm />
            <Link to="/messages" className="form-back-link">← Volver al listado</Link>
        </section>
    );
}
