
const g_blacklistDefalut = "polla|[保保寶宝].?[拉拉啦啦]|p.?o.?l.?l.?a|[吉吉告告占占].?([娃娃])+|KFC|緊急通知|瑪雅與|安娜貝爾";

$(function() {

		// BFP
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
		
		// Open in new tab
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
		
		// BlackList
    chrome.storage.local.get('enableBlacklist', function (result) {
			if (!result.enableBlacklist) {
				$('#toggle-event3').bootstrapToggle('off');
			}
			else {
				$('#toggle-event3').bootstrapToggle('on');
			}
		});
		$('#toggle-event3').change(function() {
			if ($(this).prop('checked')) {
				chrome.storage.local.set({'enableBlacklist': true});
			}
			else {
				chrome.storage.local.remove('enableBlacklist');
			}
		});

    chrome.storage.local.get('blacklist', function (res) {
			console.log(res);
			if (res.blacklist) {
				$('#blacklist').val(res.blacklist);
			}
			else {
				chrome.storage.local.set({'blacklist': g_blacklistDefalut});
				$('#blacklist').val(g_blacklistDefalut);
			}
		});

		$('#blacklist').bind('input propertychange', function() {
			console.log(this.value);
			chrome.storage.local.set({'blacklist': this.value});
		});

		$('#blacklistReset').click(() => {
			console.log('reset blacklist');
			chrome.storage.local.set({'blacklist': g_blacklistDefalut});
			$('#blacklist').val(g_blacklistDefalut);
		});


		// Enhanced Baha Reply
		chrome.storage.local.get('enableEBR', function (result) {
			if (result.enableEBR) {
				$('#toggle-event4').bootstrapToggle('on');
			}
			else {
				$('#toggle-event4').bootstrapToggle('off');
			}
		});
		$('#toggle-event4').change(function() {
			if ($(this).prop('checked')) {
				chrome.storage.local.set({'enableEBR': true});
			}
			else {
				chrome.storage.local.remove('enableEBR');
			}
		});

});