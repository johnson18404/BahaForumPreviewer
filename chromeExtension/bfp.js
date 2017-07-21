/**  BahaForumPreviewer(BFP) 巴哈討論區預覽 
 *   Version:       1.3
 *   Author:        johnson18404
 *   Date:          2017/7/22
 *   Source Code:   https://github.com/johnson18404/BahaForumPreviewer
 *   Chrome web store url: https://chrome.google.com/webstore/detail/bahaforumpreviewerbfp-%E5%B7%B4%E5%93%88%E8%A8%8E/gkclanjhoadmoehcekihchpnclggnbba?utm_source=chrome-ntp-icon
 */

var ver = 1.3;
var requestUrl= 'https://api.gamer.com.tw/mobile_app/forum/v1/B.php';
var w = 200;
var mypage, mybsn, mysubbsn;
var g_openInNewtab = false;

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
    console.log('BFP disable.');
    $('#BH-pagebtn').append( '<p class="bg-warning">BahaLoader已關閉，如需開啟請點chrome右上角圖示進入設定開啟。</p>' );
}

function permissionDenied() {
    console.log('bahaloader function permissionDenied');
    $('#BH-pagebtn').append( '<p class="bg-danger"><a href="https://user.gamer.com.tw/mobile/MB_login.php" target="_blank">[BahaLoader]: 請點此登入手機板網頁，讓程式取得預覽內容</a></p>' );
}

function matchPreview(Jdata) {
    console.log('bahaloader function matchPreview');
	// var nowid;
	// $.each( $('td[class="FM-blist3"]').toArray(), function(index, value) {  
	// 	nowid = this;
	// 	$.each(Jdata, function(){
	// 		if (nowid.id == this['snA']) {
	// 			$(nowid).html( '<b>' +  $(nowid).html() );
	// 			var img1 ="";	
	// 			if (this['thumbnail'] != "") {
	// 				 img1 = '<img class="img-thumbnail" width="' + w + '" src="' + this['thumbnail'] +'"><br>';
	// 			}
	// 			$(nowid).append('</b><br><table><tbody><tr><td></td><td style="color:#6E6E6E">'+ img1 + this['summary'] +  '</td></tr></tbody></table>');
	// 		}		
	// 	});
	// });
	if ($('td[class="FM-blist3"]').size()>0) {
        // old version
        matchPreviewOld(Jdata);
    }	
    else {
        // new version
        matchPreviewNew(Jdata);
    }
}

function matchPreviewOld(Jdata) {
    console.log('bahaloader function matchPreviewOld');
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

function matchPreviewNew(Jdata) {
    console.log('bahaloader function matchPreviewNew');

    $('tr.b-list__row').each((i, elmt)=>{
        var snA = parseInt($(elmt).find('td.b-list__summary:first').find('a:first').attr('name'));
        var article = $(elmt).find('td.b-list__main');

        // change article title style
        var articleTitle = article.find('a:first');
        articleTitle.attr('style', 'font-size: 17px; font-weight: bold;');
        if (g_openInNewtab) articleTitle.attr('target', '_blank');

        $.each(Jdata, function() {
			if (snA == this['snA']) {
                // console.log('match');

  
                // thumbnail
				var img1 ="";	
				if (this['thumbnail'] != "") {
					 img1 = '<div style="padding: 1%; padding-top: 0;"><img class="img-thumbnail" width="' + w + '" src="' + this['thumbnail'] +'"></div>';
				}
				// article summary
				article.append('<div style="margin-left: 10%; padding-top: 1%; color:#6E6E6E; line-height: 20.7px; letter-spacing: 0.3px;">'+ img1 + this['summary'] +  '</div><hr style="margin: 3px; margin-left: 10%;"/>');
			}		
		});
    });
}

function main() {
    console.log('BahaForumPreviewer is loaded. version: v' + ver);
    
    chrome.storage.local.get('DonotOpenNewTab', function (result) {
        //console.log('DonotOpenNewTab=');
        //console.log(result.DonotOpenNewTab);
        
		if (!result.DonotOpenNewTab) {
            g_openInNewtab = true;
            $.each( $('td[class="FM-blist3"] > a').toArray(), function(index, value) {  
                $(this).attr('target', '_blank');
            });
        }
    });
    

    
    // set ajax parameter
    mypage = getParameterByName('page');
    if (mypage == undefined) mypage = 1;
    mybsn = getParameterByName('bsn');
    console.log('page=%s, bsn=%s', mypage, mybsn);
    
    // ajax request
    $.ajax({
	  url: requestUrl,
	  data: {'page': mypage, 'bsn': mybsn, '_version': 81, 'ltype': ''},
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
    console.log('BFP ready.');
    
    chrome.storage.local.get('stop', function (result) {
		if (result.stop) 
            BahaLoaderDisable();
        else
            main();
    });
});
