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