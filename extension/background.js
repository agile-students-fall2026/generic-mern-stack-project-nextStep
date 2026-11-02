// This is the background script for Chrome Extension
// This works on the back ground to check which tabs are open

async function findTabs(website) {
    // Use the chrome.tabs API to find all tabs that match the given website URL
    // Used wild card to match any other domain
    return chrome.tabs.query({ url: `*://*.${website}/*` });
}

// Answers the bridge when a request is sent
// Without this, the bridge will not be able to get the tabs
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    findTabs(message.website).then(tabs => sendResponse(tabs))
    return true
})