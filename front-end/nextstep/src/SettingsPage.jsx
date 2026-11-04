import { useNavigate } from 'react-router-dom'
import './css/pages.css'

function SettingsPage() {
    const navigate = useNavigate()
    return (
        <div className="screen">
            <main className="content">
                <h1 className="page-title">Settings</h1>
                <button onClick={() => navigate('/profile')}>
                    Profile
                </button>

                <button onClick={() => navigate('/login')}>
                    Sign Out
                </button>
            </main>
            <button
                className="menu button"
                onClick={() => navigate('/menu')}>
                Menu
            </button>
        </div>
    )
}
export default SettingsPage