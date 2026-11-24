import { useNavigate } from 'react-router-dom'
import AuthContext from './assets/AuthProvider'
import useAccessibility from './useAccessibility'
import './css/pages.css'
import { useContext } from 'react'

function SettingsPage() {
    const navigate = useNavigate()
    const { setAuth } = useContext(AuthContext)
    const handleLogout = () => {
        setAuth({})
        document.documentElement.style.fontSize = '100%'
        document.body.classList.remove('dark-mode')
        document.body.classList.remove('low-contrast')
        navigate('/login')
    }
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
                    <button className="btn btn-secondary" type="button" onClick={() => navigate('/request-history')}>My Requests</button>

                    <button className="btn btn-secondary" type="button" onClick={handleLogout}>Log Out</button>

                    <button className="btn btn-secondary" type="button" onClick={() => navigate('/home')}>Home</button>

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
