import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAccessibility from './useAccessibility';
import './css/pages.css';
import { useContext } from 'react';
import AuthContext from './assets/AuthProvider';
import api from './api';


// Page where the user asks for a how-to we don't have yet.
const RequestPage = () => {
    useAccessibility();
    const { auth } = useContext(AuthContext);

    async function sendRequest() {
        await api.post('/requests', { text: comment }, {
            headers: { Authorization: `Bearer ${auth.accessToken}` }
        });
        navigate('/request-history');
    }
    
    // keeps the text the user types. Needs useState because a regular
    // variable would go back to empty every time React redraws the page.
    const [comment, setComment] = useState('');

    // Lets us send the user to another page when a button is clicked.
    const navigate = useNavigate();

    return (
        <div className="screen request-screen">

            <main className="content request-content">
                <button className="back-button" onClick={() => navigate('/home')}>Back</button>
                <header className="page-header">
                    <h1 className="page-title">Request a new how-to</h1>
                    <p className="page-description">Tell us what you want to learn.</p>
                </header>
                {/* value shows the state, onChange updates it on every keystroke */}
                <div className="request-form">
                    <textarea
                        id="request-comment"
                        className="request-textarea"
                        rows="6"
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
                    />

                    <button className="btn btn-primary" onClick={sendRequest}>Send</button>
                </div>
            </main>
        </div>
    );
};

export default RequestPage;
