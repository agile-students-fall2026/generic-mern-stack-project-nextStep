// This is the bridge script for Chrome Extension
// This connects the front-end and background scripts

console.log('bridge working')
window.addEventListener('message', event => {
    // event is the message sent from the front-end 
    // for example, if the front-end sends a message like this:
    // window.postMessage({ taskID: 'youtube-fullscreen' })
    // for now, the event data is not considered, all the request will go to youtube/watch webpage
    
    // This if statement is to block any other messages that are not from our nextStep front-end
    // There are multiple messages that are sent from the front-end, but we only want to listen to the messages that are from our nextStep front-end
    if (event.data.from !== 'nextStep') {
        return
    }
    chrome.runtime.sendMessage(event.data)
})