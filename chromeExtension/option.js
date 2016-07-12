
$(function() {
 
  
    chrome.storage.local.get('stop', function (result) {
		if (!result.stop) {
			$('#toggle-event').bootstrapToggle('on');
		}
    });

    $('#toggle-event').change(function() {
		if ($(this).prop('checked')) {
			chrome.storage.local.remove('stop');
		}
		else {
			chrome.storage.local.set({'stop': true});
		}
    });
    
    chrome.storage.local.get('DonotOpenNewTab', function (result) {
		if (!result.DonotOpenNewTab) {
			$('#toggle-event2').bootstrapToggle('on');
		}
    });

    $('#toggle-event2').change(function() {
		if ($(this).prop('checked')) {
			chrome.storage.local.remove('DonotOpenNewTab');
		}
		else {
			chrome.storage.local.set({'DonotOpenNewTab': true});
		}
    });
    
});