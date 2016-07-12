chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.create({ url: 'option.html' });
});