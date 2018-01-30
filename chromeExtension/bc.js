

function bc_main() {
    console.log('bc main');
    if (!g_enableBlacklist) return;

    var $ = jQuery;
    $.each($('div.popular__item'), (i, item) => {
        var t = $(item).find('a');
        if (g_blacklist.test($(t[1]).text())) {
            $(t[0]).hide();
        }
    });
}

(function() {
    setTimeout(bc_main, 2000);

})();

