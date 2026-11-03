// This is the background script for Chrome Extension
// This works on the back ground to check which tabs are open

// findTabs function takes a website URL and returns tab information for all tabs that match the website url
async function findTabs(website) {
    // Use the chrome.tabs API to find all tabs that match the given website URL
    // Used wild card to match any other domain
    return chrome.tabs.query({ url: website });
}

// For now, user can only go to youtube.com/watch so we can have something for sprint 1 stand up
const website = '*://*.youtube.com/watch*';
const not_open = "https://www.youtube.com/watch?v=jIxs89D9MDY";

// goToSite returns the tab id of the website if it is already open, or opens a new tab and returns the tab id of the new tab
async function goToSite() {
    // Check if the tab is already open
    const tabs = await findTabs(website);

    if (tabs.length > 0) {
        // If the tab is already open, switch to that tab
        chrome.tabs.update(tabs[0].id, { active: true });
        // Return the tab id so we can use it for injection
        return tabs[0].id;
    }

    // If the tab is not open, open a new tab with the website
    const newTab = await chrome.tabs.create({ url: not_open });
    // Return the tab id so we can use it for injection
    return newTab.id}

// Injects a script to web to draw an arrow for guidance
async function drawArrow(){
    // Retriving the side id 
    const tabId = await goToSite();
    // Injecting the script to draw an arrow on the tab
    await chrome.scripting.executeScript({
        target: {tabId},
        files: ['direction.js']
    })
}

// Listen for messages from the Bridge or front-end
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    drawArrow();
    return true;
})