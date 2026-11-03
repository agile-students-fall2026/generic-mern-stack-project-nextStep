// This file is to make arrows and guidance to user's screen. 
// It will be used to guide the user to the task webpage.

// This button variable is finding the fullscreen button object in html 
const button = document.querySelector('.ytp-fullscreen-button')
console.log('button', button)


if (button){
    // variable location keeps the location of the button on the screen. It is used to draw an arrow to the button.    
    // This is to make the button more visible to the user. It will draw a red outline around the button.
    if (button){
        button.style.outline = '5px solid red'
    }
    
    // Arrow variable is a div element that will be used to draw an arrow to the button. It is used to guide the user to the button.
    const arrow = document.createElement('div')

    // \u279C is arrow unicode character
    arrow.textContent = 'Click here to make the video big \u279C' 
    
    arrow.style.cssText = `
        position: fixed;
        padding: 12px 16px;
        font: 20px system-ui, sans-serif;
        color: white;
        background: #ff3b30;
        border-radius: 10px;
        z-index: 99999;
        pointer-events: none;
    `
    document.body.appendChild(arrow)

    // The screen changes size when the user resizes the window, so we need to reposition the arrow when the window is resized.
    // The screen also changes after loading the website, therefore needs to resize the arrow button.
    function place() {
        const location = button.getBoundingClientRect()
        arrow.style.left = `${location.left - 360}px`
        arrow.style.top = `${location.top - 8}px`
    }

    place();
    // This function is to resize the button when scroll occurs
    window.addEventListener('scroll',place)
    // This function is to resize the button when resize occurs. 
    window.addEventListener('resize',place)
}