/**
 *  Content Script http://forum.gamer.com.tw/B.php*
 */

"use strict";

// const IMAGE_WIDTH = 200;
// const BLACKLIST = "polla|[保保寶宝].?[拉拉啦啦]|p.?o.?l.?l.?a|[吉吉告告占占].?([娃娃])+|KFC|緊急通知|瑪雅與|安娜貝爾";

 // global default config
//  var g_config = {
//     EnableBFP: true, 
//     OpenInNewTab: true,
//     FilterThumb: false,
//     BlackList: BLACKLIST,
//     EnableAdvReply: false
//  }


// get current page parameter from url.
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}


function RequestThumbData() {
    return new Promise((resolve, reject) => {
        // console.log('function RequestThumbData().');

        let mypage = getParameterByName('page');
        if (mypage == undefined) mypage = 1;
        let mybsn = getParameterByName('bsn');
        // console.log('page=%s, bsn=%s', mypage, mybsn);

        // // ajax request
        // $.ajax({
        //     url: 'https://api.gamer.com.tw/mobile_app/forum/v1/B.php',
        //     data: {'page': mypage, 'bsn': mybsn, '_version': 81, 'ltype': ''},
        //     type: "GET",
        //     dataType: "json",
        //     success: function(Jdata) {
        //         // console.log('ajax success');
                
        //         if (Jdata['code'] == 1) { // permission denied
        //             console.log('permissionDenied();');
        //             $('#BH-pagebtn').append( '<p class="bg-danger"><a href="https://user.gamer.com.tw/mobile/MB_login.php" target="_blank">[BahaLoader]: 請點此登入手機板網頁，讓程式取得預覽內容</a></p>' );
        //             reject();
        //             return;
        //         }
                
        //         // matchPreview(Jdata['list']);
        //         resolve(Jdata['list'])
        //     },
        //     error: function() {
        //         console.log('ajax error');
        //         reject();
        //     }
        // });

        // chrome 73 Avoid Cross-Origin Fetches in Content Scripts
        chrome.runtime.sendMessage(
            {
                contentScriptQuery: 'fetchUrl',
                url: `https://api.gamer.com.tw/mobile_app/forum/v1/B.php?page=${mypage}&bsn=${mybsn}&_version=81&ltype=`
            },
            response => {
                // console.log(response);
                let Jdata = JSON.parse(response);
                // console.log(Jdata['list']);
                resolve(Jdata['list']);
            }
        );
    });
}


(async function() {
    if (location.href.search('B.php') == -1) {
        console.log('url not match.');
        return;
    }
    console.log('B.js loaded.');
    let g_config = await Init();
    // console.log(g_config);

    // BFP
    if (g_config.EnableBFP) {
        Promise.all([
            RequestThumbData(), 
            new Promise((resolve, reject) => {
                $(document).ready(function () {
                    // console.log('document ready.');
                    resolve();
                });
            }) 
        ]).then(values => { 
            // console.log('all finish.');
            // console.log(values); // [3, 1337, "foo"] 
            let thumbData = values[0];
            // console.log(thumbData);
    
            let thumbDataObj = {};
            Array.from(thumbData).forEach(i => {
                thumbDataObj[i.snA] = {
                    summary: i.summary,
                    thumbnail: i.thumbnail
                }
            });
            // console.log(thumbDataObj);
    
            // iterrate articles
            Array.from($('tr.b-list__row')).forEach(row => {
                let snA = parseInt($(row).find('td.b-list__summary:first').find('a:first').attr('name'));
                let article = $(row).find('td.b-list__main');
    
                 // change article title style
                let articleTitle = article.find('a:first');
                articleTitle.attr('style', 'font-size: 17px; font-weight: bold;');
                if (g_config.OpenInNewTab) articleTitle.attr('target', '_blank');
    
    
                if (!thumbDataObj[snA]) return; // undefined snA number.
    
                let img1 ="";	
                if (thumbDataObj[snA]['thumbnail'] != "") {
                    img1 = '<div style="padding: 1%; padding-top: 0;"><img class="img-thumbnail" width="' + g_config.IMAGE_WIDTH + '" src="' + thumbDataObj[snA]['thumbnail'] +'"></div>';
                }
                // article summary
                article.append('<div style="margin-left: 10%; padding-top: 1%; color:#6E6E6E; line-height: 20.7px; letter-spacing: 0.3px;">'+ img1 + thumbDataObj[snA]['summary'] +  '</div><hr style="margin: 3px; margin-left: 10%;"/>');

            });
        }); // promise
    }
})();