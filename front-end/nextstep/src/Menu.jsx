import './css/pages.css';
import { Link } from 'react-router-dom';

export default function Menu(){


    return (
    <>
    
    <div className="menu-page-heading">
    <h1>Menu Page</h1>
    </div>
    <ul className="menu-link">
        <li><Link className = "menu-page-button" to="/Home"> Home </Link></li>
        <li><Link className = "menu-page-button" to="/AccessibilityPage"> Accessibility </Link></li>
        <li><Link className = "menu-page-button" to="/ProfilePage"> Profile </Link></li>
        <li><Link className = "menu-page-button" to="/SettingsPage"> Settings </Link></li>
        
    </ul>
    </>

    )
};
