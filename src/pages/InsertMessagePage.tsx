import { Link } from 'react-router-dom';
import MessageForm from '../components/MessageForm';

export default function InsertMessagePage() {
    return (
        <section>
            <h1>Enviar Mensaje</h1>
            <MessageForm />
            <br />
            <Link to="/messages">← Volver al listado</Link>
        </section>
    );
}