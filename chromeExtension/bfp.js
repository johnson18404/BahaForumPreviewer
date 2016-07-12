//console.log('bfp v0.5');

var requestUrl= 'http://api.gamer.com.tw/mobile_app/forum/v1/B.php';
var w = 200;
var mypage, mybsn, mysubbsn;

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function BahaLoaderDisable() {
    console.log('bahaloader function disable');
    $('#BH-pagebtn').append( '<p class="bg-warning">BahaLoader已關閉，如需開啟請點chrome右上角圖示進入設定開啟。</p>' );
}

function permissionDenied() {
    console.log('bahaloader function permissionDenied');
    $('#BH-pagebtn').append( '<p class="bg-danger"><a href="https://user.gamer.com.tw/mobile/MB_login.php" target="_blank">[BahaLoader]: 請點此登入手機板網頁，讓程式取得預覽內容</a></p>' );
}

function matchPreview(Jdata) {
    //console.log('bahaloader function matchPreview');
	var nowid;
	$.each( $('td[class="FM-blist3"]').toArray(), function(index, value) {  
		nowid = this;
		$.each(Jdata, function(){
			if (nowid.id == this['snA']) {
				$(nowid).html( '<b>' +  $(nowid).html() );
				var img1 ="";	
				if (this['thumbnail'] != "") {
					 img1 = '<img class="img-thumbnail" width="' + w + '" src="' + this['thumbnail'] +'"><br>';
				}
				$(nowid).append('</b><br><table><tbody><tr><td></td><td style="color:#6E6E6E">'+ img1 + this['summary'] +  '</td></tr></tbody></table>');
			}		
		});
	});
		
}

function main() {
    //console.log('bahaloader function main');
    
    chrome.storage.local.get('DonotOpenNewTab', function (result) {
        //console.log('DonotOpenNewTab=');
        //console.log(result.DonotOpenNewTab);
        
		if (!result.DonotOpenNewTab) 
            $.each( $('td[class="FM-blist3"] > a').toArray(), function(index, value) {  
                $(this).attr('target', '_blank');
            });
    });
    

    
    // set ajax parameter
    mypage = getParameterByName('page');
    if (mypage == undefined) mypage = 1;
    mybsn = getParameterByName('bsn');
    console.log('page=%s, bsn=%s', mypage, mybsn);
    
    // ajax request
    $.ajax({
	  url: requestUrl,
	  data: {'_android': 'tw.com.gamer.android.activecenter', 'page': mypage, 'bsn': mybsn, '_version': 79, 'ltype': ''},
	  type: "GET",
	  dataType: "json",
	  success: function(Jdata) {
		//console.log(Jdata);
		console.log('ajax success');
		
		if (Jdata['code'] == 1) { // permission denied
			permissionDenied();
            return;
		}
		
		matchPreview(Jdata['list']);
	  },
	  error: function() {
		console.log('ajax error');
	  }
	});

}


$(document).ready(function(){
    console.log('bfp ready');
    
    chrome.storage.local.get('stop', function (result) {
		if (result.stop) 
            BahaLoaderDisable();
        else
            main();
    });
});
