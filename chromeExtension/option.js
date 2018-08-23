
'use strict';

(async function() {
	console.log('option.js loaded.');

	let g_config = await Init();
	console.log(g_config);

	function Save() {
		chrome.storage.local.set({config: g_config});
		console.log('save change.');
	}

	// BlackList
	$('#blacklistReset').click(() => {
		console.log('reset blacklist');
		$('#blacklist').val(BLACKLIST);
		g_config.BlackList = BLACKLIST;
		Save();
	});

	$('#blacklist').val(g_config.BlackList);

	$('#blacklist').bind('input propertychange', function() {
		console.log(this.value);
		g_config.BlackList = this.value;
		Save();
	});



	// other config
	Array.from($('input[group="config"]')).forEach(i => {
		let id = $(i).prop('id');
		// if (g_config[id]) $(i).prop('checked', true);
		if (g_config[id]) $(i).bootstrapToggle('on');

		// console.log(g_config[id]);

		$(i).change(function() {
			g_config[id] = $(this).prop('checked');

			console.log(g_config);
			Save();
		});
	});

})();



