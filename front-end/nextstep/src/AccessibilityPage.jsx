import useAccessibility, { FONT_SIZES } from './useAccessibility'
import { useNavigate } from 'react-router-dom'
import './css/pages.css'

function AccessibilityPage() {
    const [settings, update] = useAccessibility()  //loading the settings user inputed
    const navigate = useNavigate()


    return (
        <div className="screen accessibility-screen">
            <main className="content accessibility-content">
                <button type="button" className="back-button" onClick={() => navigate('/settings')}>
                    Back
                </button>
                <header className="page-header">
                    <h1 className="page-title">Accessibility</h1>
                </header>
                <p className="page-description">
                    Customize NextStep to make it easier for you to read and use.
                </p>
                {/*fontsize is controlled*/}
                <div className="accessibility-options">
                    <section className="accessibility-option">
                        <h2 className="accessibility-label">Font Size</h2>
                        <select
                            className="accessibility-select"
                            value={settings.sizeIndex}  //{/*tracks users selection and converts it to array index for font size */}
                            onChange={e => update({ sizeIndex: Number(e.target.value) })}>
                            {FONT_SIZES.map((size, index) => (
                                <option key={size} value={index}>
                                    {size}%
                                </option>
                            ))}
                        </select>
                    </section>

                    {/* Dark Mode controlled */}
                    <section className="accessibility-option">
                        <h2 className="accessibility-label">Dark Mode</h2>

                        <label className="accessibility-toggle">
                            <input
                                className="accessibility-checkbox"
                                type="checkbox"
                                checked={settings.darkMode}
                                onChange={e => update({ darkMode: e.target.checked })} />
                            On
                        </label>
                    </section>

                    {/* Contrast mode controlled */}
                    <section className="accessibility-option">
                        <h2 className="accessibility-label">Low Contrast</h2>
                        <label className="accessibility-toggle">
                            <input
                                className="accessibility-checkbox"
                                type="checkbox"
                                checked={settings.lowContrast}
                                onChange={e => update({ lowContrast: e.target.checked })} />
                            On
                        </label>

                    </section>
                </div>
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

export default AccessibilityPage