import { useState, useEffect } from 'react'
import AuthContext from './assets/AuthProvider'
import { useContext } from 'react'

export const FONT_SIZES = [80, 100, 112, 125, 150] //tracking font size 

//const KEY = 'nextStep-accessibility'    //tracking name saved in local storage 

const DEFAULT = { sizeIndex: 1, darkMode: false, lowContrast: false }   //default settings for users 

// function load() {
//     try {
//         return { ...DEFAULT, ...JSON.parse(localStorage.getItem(KEY)) }  //tracks if any changes are made to local storage aka font size, dark mode, low contrast and returns it 
//     } catch {
//         return DEFAULT  //otherwise returns defaults settings 
//     }
// }

export default function useAccessibility() {
    const [settings, setSettings] = useState(DEFAULT)  //storings users preferences 
    const { auth } = useContext(AuthContext)
    const token = auth?.accessToken
    const [loaded, setLoaded] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {   //user preferences changes the settings 
        // document.documentElement.style.fontSize = `${FONT_SIZES[settings.sizeIndex]}%`  //updates dont size 
        // document.body.classList.toggle('dark-mode', settings.darkMode)  //updates dark mode on or off
        // document.body.classList.toggle('low-contrast', settings.lowContrast)    //updates low contrast on or off
        // try {
        //     localStorage.setItem(KEY, JSON.stringify(settings)) //the inputs are saved and are able to stick after page is refreshed 
        // } catch {
        // }

        //loading the preferences selected for account
        const TaskController = new AbortController()

        setSettings(DEFAULT)
        setLoaded(false)
        setError('')

        if (!token) {
            setLoaded(true)
            return () => TaskController.abort()
        }

        async function loadPreferences() {
            try {
                const response = await fetch('/api/profile/accessibility', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    signal: TaskController.signal
                })
                if (!response.ok) {
                    throw new Error("Failed to load preferences")
                }
                const data = await response.json()

                if (!TaskController.signal.aborted) {
                    setSettings({ ...DEFAULT, ...data.accessibility })
                    setLoaded(true)
                }
            } catch (error) {
                if (!TaskController.signal.aborted) {
                    console.error(error)
                    setError('Accessibilities not loaded')
                }
            }
        }
        loadPreferences()
        return () => TaskController.abort()
    }, [token])

    //set accessibilities preferences to the page
    useEffect(() => {
        document.documentElement.style.fontSize = `${FONT_SIZES[settings.sizeIndex]}%`
        document.body.classList.toggle('dark-mode', settings.darkMode)
        document.body.classList.toggle('low-contrast', settings.lowContrast)
        //well reset the setting to default when logged out
        return () => {
            document.documentElement.style.fontSize = `${FONT_SIZES[DEFAULT.sizeIndex]}%`
            document.body.classList.remove('dark-mode')
            document.body.classList.remove('low-contrast')
        }
    }, [settings])

    //updating preferences altered 
    const update = async (changes) => {
        if (!token || !loaded) return

        const updatedSettings = { ...settings, ...changes }
        setSettings(updatedSettings)
        setError('')

        try {
            const response = await fetch('/api/profile/accessibility', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(updatedSettings)
            })

            if (!response.ok) {
                throw new Error('Save preferences failed')
            }
        } catch (error) {
            console.error(error)
            setError('Failed to save accessibility preferences')
        }
    }
    return [settings, update, loaded, error]
}