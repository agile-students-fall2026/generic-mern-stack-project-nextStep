// This is the background script for Chrome Extension
// This works on the back ground to check which tabs are open

async function findTabs(website) {
    // Use the chrome.tabs API to find all tabs that match the given website URL
    // Used wild card to match any other domain
    return chrome.tabs.query({ url: `*://${website}/*` });
}