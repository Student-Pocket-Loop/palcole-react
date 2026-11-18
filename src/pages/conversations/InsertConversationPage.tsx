import { Link } from 'react-router-dom';
import ConversationForm from '../../components/conversations/ConversationForm';

export default function InsertConversationPage() {
    return (
        <section className="form-page">
            <h1>Crear Conversación</h1>
            <ConversationForm />
            <Link to="/conversations" className="form-back-link">← Volver al listado</Link>
        </section>
    );
}
