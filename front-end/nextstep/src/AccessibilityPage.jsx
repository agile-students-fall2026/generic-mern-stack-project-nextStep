import useAccessibility, { FONT_SIZES } from './useAccessibility'
import './css/pages.css'

function AccessibilityPage() {
    const [settings, update] = useAccessibility()  //loading the settings user inputed

    return (
        <div className="screen">
            <main className="content">
                <h1 className="page-title">Accessibility</h1>
                {/*fontsize is controlled*/}
                <section>
                    <h2>Font Size</h2>
                    <select
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
                <section>
                    <h2>Dark Mode</h2>

                    <label>
                        <input
                            type="checkbox"
                            checked={settings.darkMode}
                            onChange={e => update({ darkMode: e.target.checked })} />
                        On
                    </label>
                </section>

                {/* Contrast mode controlled */}
                <section>
                    <h2>Low Contrast</h2>

                </section>
            </main>
        </div>
    )
}

export default AccessibilityPage