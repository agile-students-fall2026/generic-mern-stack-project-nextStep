import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import useAccessibility from './useAccessibility';
import AuthContext from './assets/AuthProvider';
import api from './api';
import './css/pages.css';

// Shows the how-to requests this user has sent.
const RequestHistoryPage = () => {
    useAccessibility();
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);

    // Starts empty, then fills in when the server answers.
    const [requests, setRequests] = useState([]);

    // Runs once when the page opens and asks the server for this user's requests.
    useEffect(() => {
        api.get('/requests', {
            headers: { Authorization: `Bearer ${auth.accessToken}` }
        }).then((response) => setRequests(response.data));
    }, [auth.accessToken]);

    return (
        <div className="screen">
            <main className="content">
                <button className="back-button" onClick={() => navigate('/settings')}>Back</button>
                <header className="page-header">
                    <h1 className="page-title">My requests</h1>
                </header>

                {requests.length === 0 && <p>You have not sent any requests yet.</p>}

                {/* map turns each request into one list item */}
                <ul className="request-history-list">
                    {requests.map((request) => (
                        <li key={request.id} className="request-history-item">
                            <p>{request.text}</p>
                            <p>Sent: {request.date}</p>
                            <p>Status: {request.status}</p>
                        </li>
                    ))}
                </ul>
            </main>
        </div>
    );
};

export default RequestHistoryPage;
