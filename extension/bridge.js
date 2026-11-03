// This is the bridge script for Chrome Extension
// This connects the front-end and background scripts

chrome.runtime.sendMessage({ pattern: '*://*.youtube.com/*' }, tabs => {
  console.log('tabs found:', tabs)
})
