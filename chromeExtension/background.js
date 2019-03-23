chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.create({ url: 'option.html' });
});

function DeleteConfig() {
    chrome.storage.local.remove('config');
    console.log('deleted.');
}

function CheckConfig() {
    chrome.storage.local.get(null, function (result) {
        console.log(result);
        console.log('checked.');
    });
}

// chrome 73 Avoid Cross-Origin Fetches in Content Scripts
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.contentScriptQuery == 'fetchUrl') {
        // WARNING: SECURITY PROBLEM - a malicious webpage may abuse
        // the message handler to get access to arbitrary cross-origin
        // resources.
        fetch(request.url)
            .then(response => response.text())
            .then(text => sendResponse(text))
            .catch(error => {
                console.log('fetch error.');
            })
        return true;  // Will respond asynchronously.
      }
    });