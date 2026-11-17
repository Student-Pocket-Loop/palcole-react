import { Link } from 'react-router-dom';
import ConversationForm from '../components/ConversationForm';

export default function InsertConversationPage() {
    return (
        <section>
            <h1>Crear Conversación</h1>
            <ConversationForm />
            <br />
            <Link to="/conversations">← Volver al listado</Link>
        </section>
    );
}