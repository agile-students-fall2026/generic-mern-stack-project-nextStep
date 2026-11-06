import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/pages.css';

// Page where the user asks for a how-to we don't have yet.

const RequestPage = () => {
    // keeps the text the user types. Needs useState because a regular
    // variable would go back to empty every time React redraws the page.
    const [comment, setComment] = useState('');

    // Lets us send the user to another page when a button is clicked.
    const navigate = useNavigate();

    return (
        <div className="screen">
            <button onClick={() => navigate('/home')}>Back</button>

            <main className="content">
                <h1 className="page-title">Request a new how-to</h1>
                <p className="page-description">Tell us what you want to learn.</p>

                {/* value shows the state, onChange updates it on every keystroke */}
                <textarea
                    rows="6"
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                />

                <button onClick={() => navigate(`/home`)}>Send</button>
            </main>
        </div>
    );
};

export default RequestPage;
