import './css/pages.css';
import { Link } from 'react-router-dom';
import useAccessibility from './useAccessibility';

export default function Menu() {
    useAccessibility();

    return (
        <>

            <div className="screen menu-page">
                <main className="content menu-content">
                    <header className="page-header">
                        <h1 className="page-title">Menu Page</h1>
                    </header>
                    <ul className="menu-link">
                        <li><Link className="btn btn-secondary" to="/Home"> Home </Link></li>
                        <li><Link className="btn btn-secondary" to="/profile"> Profile </Link></li>
                        <li><Link className="btn btn-secondary" to="/settings"> Settings </Link></li>

                    </ul>
                </main>
            </div>
        </>

    )
};
