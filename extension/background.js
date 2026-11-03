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
const not_open = "https://www.youtube.com/watch?v=jIxs89D9MDY&list=RDjIxs89D9MDY";

// goToSite fucntion takes the user to the website if the tab is already open, otherwise it opens a new tab with the website
async function goToSite() {
    // Check if the tab is already open
    const tabs = await findTabs(website);

    if (tabs.length > 0) {
        // If the tab is already open, switch to that tab
        chrome.tabs.update(tabs[0].id, { active: true });
        return 'Tab is already open, switching to that tab.';
    }

    // If the tab is not open, open a new tab with the website
    await chrome.tabs.create({ url: not_open }), {active: true};
    return 'Tab is not open, opening a new tab with YouTube video on'
}


// Listen for messages from the Bridge or front-end
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    sendResponse(goToSite());
    return true;
})