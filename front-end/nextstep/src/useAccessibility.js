import { useState, useEffect } from 'react'

export const FONT_SIZES = [80, 100, 112, 125, 150] //tracking font size 

const KEY = 'nextStep-accessibility'    //tracking name saved in local storage 

const DEFAULT = { sizeIndex: 1, darkMode: false, lowContrast: false }   //default settings for users 

function load() {
    try {
        return { ...DEFAULT, ...JSON.parse(localStorage.getItem(KEY)) }  //tracks if any changes are made to local storage aka font size, dark mode, low contrast and returns it 
    } catch {
        return DEFAULT  //otherwise returns defaults settings 
    }
}

export default function useAccessibility() {
    const [settings, setSettings] = useState(load)  //storings users preferences 

    useEffect(() => {   //user preferences changes the settings 
        document.documentElement.style.fontSize = `${FONT_SIZES[settings.sizeIndex]}%`  //updates dont size 
        document.body.classList.toggle('dark-mode', settings.darkMode)  //updates dark mode on or off
        document.body.classList.toggle('low-contrast', settings.lowContrast)    //updates low contrast on or off
        try {
            localStorage.setItem(KEY, JSON.stringify(settings)) //the inputs are saved and are able to stick after page is refreshed 
        } catch {
        }
    }, [settings])


    const update = changes => {
        setSettings(s => ({ ...s, ...changes }))
    }
    return [settings, update]
}