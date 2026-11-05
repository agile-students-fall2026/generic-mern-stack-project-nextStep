import { useNavigate } from 'react-router-dom'
import './css/pages.css'

function SettingsPage() {
    const navigate = useNavigate()
    return (
        <div className="screen settings-screen">
            {/*back button to return to menu page */}
            <button type="button" className onClick={() => navigate('/menu')}>
                Back
            </button>
            <main className="content settings-content">
                <header className='page-header'>
                    <h1 className="page-title">Settings</h1>
                </header>
                <button onClick={() => navigate('/accessibility')}>
                    Accessibility
                </button>

                <button onClick={() => navigate('/login')}>
                    Sign Out
                </button>
            </main>
            <button
                className="menu-button"
                onClick={() => navigate('/menu')}>
                Menu
            </button>
        </div>
    )
}
export default SettingsPage