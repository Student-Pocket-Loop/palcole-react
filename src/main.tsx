import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';
import './styles/Layout.css';
import './styles/MainPage.css';
import './styles/Card.css';
import './styles/ListPage.css';
import './styles/DetailPage.css';
import './styles/Form.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
