import { useNavigate } from 'react-router-dom'
import useAccessibility from './useAccessibility'
import './css/pages.css'

function SettingsPage() {
    const navigate = useNavigate()
    useAccessibility()

    return (
        <div className="screen settings-screen">
            <main className="content menu-content">
                <header className="page-header">
                    <h1 className="page-title">
                        Settings
                    </h1>
                </header>
                <section className="settings-options">
                    <button className="btn btn-secondary" type="button" onClick={() => navigate('/accessibility')}>
                        Accessability
                    </button>

                    <button className="btn btn-secondary" type="button" onClick={() => navigate('/login')}>Log Out</button>

                    <button className="btn btn-secondary" type="button" onClick={() => navigate('/home')}>Back to Home</button>

                </section>
            </main>
            <button
                type="button"
                className="menu-button"
                onClick={() => navigate('/menu')}
            >
                Menu
            </button>
        </div>
    )
}

export default SettingsPage
