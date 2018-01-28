/**
 *  ebr.js Enhanced Baha Reply
 */

function EnhancedBahaReply() {
    'use strict';
    var version = 1.0;
    var $ = jQuery;
    var g_List = [];

    var myMarkBtnCss = `
        background:none!important;
        border:none;
        padding:0!important;
        cursor:pointer;
        font-size: 12px;
        font-family:arial,sans-serif;
        text-decoration:underline;
        margin-left: 10px;
    `;

    var Record = {
        load: () => {
            var record;
            record = localStorage.getItem("fool_user_id");
            if (record == null) record = [];
            else record = JSON.parse(record);

            return record;
        },
        insert: (userID) => {
            // load currert
            var record = Record.load();

            // insert id
            if (record.includes(userID)) return false;
            record.push(userID);

            // write back
            localStorage.setItem('fool_user_id', JSON.stringify(record));
            return true;
        },
        remove: (userID) => {
            // load currert
            var record = Record.load();

            // remove id
            var index = record.indexOf(userID);
            if (index < 0) return false;
            record.splice(index, 1);

            // write back
            localStorage.setItem('fool_user_id', JSON.stringify(record));
            return true;
        }
    };


    var ContentVisibility = {
      show: (elmt) => {
          var t = $(elmt);
          $(t.find('img')[0]).css('opacity', ''); // avatar
          $(t.find('a.reply-content__user')[0]).css('color', ''); // id
          $(t.find('article.reply-content__article')[0]).css('color', ''); // link
          $(t.find('input.myMarkBtn')[0]).attr('value', 'X');
      },
      hide: (elmt) => {
          var t = $(elmt);
          $(t.find('img')[0]).css('opacity', '0.2'); // avatar
          $(t.find('a.reply-content__user')[0]).css('color', '#8080802b'); // id
          $(t.find('article.reply-content__article')[0]).css('color', '#8080802b'); // link
          $(t.find('input.myMarkBtn')[0]).attr('value', 'cancel');
      }
    };

    function MarkContent(action, crt_i, tag_userID) {
        for (var i=crt_i-1; i>=0; i--) {
            if (g_List[i].userID.replace(/：$/, '') == tag_userID) {
               if (action == 1) {
                   $(g_List[i].elmt).attr('style', 'border: 2px solid;     border-color: red;');
               }
               else if (action == 0) {
                   $(g_List[i].elmt).attr('style', '');
               }
            }
        }
    }

    function TagUserName(tag_i, elmt) {
        var t = $( $(elmt).find('a.reply-content__user')[0] );
        t.text( t.text().replace(/：$/, '') + '：' );

        $.each($( $(elmt).find('article.reply-content__article')[0] ).find('a'), (i, y) => {
           if ($(y).attr('onclick') == undefined) {
               var userID = $(y).text();
               var show = false;
               $(y)
                   .attr('style', 'border: 1px solid;    border-color: gray;    border-radius: 5px;')
                   .mouseenter(() => {
                       show = true;
                       MarkContent(1, tag_i, userID);
                   })
                   .mouseleave(() => {
                       // MarkContent(0, tag_i, userID);
                       show = false;
                       setTimeout(() => {
                           if (show == false)
                               MarkContent(0, tag_i, userID);
                       }, 500);

                   });
           }
        });
    }

    function f1() {
        console.log(`Enhanced Baha Reply ver:${version}`);

        g_List = [];
        var arr = $('div.c-reply__item');
        var record = Record.load();

        $.each(arr, (i, elmt) => {
            // get current userID
            var userID = ($($(elmt).find('a.reply-content__user')[0])).text().replace(/：$/, '');
            
            // TagUserName
            TagUserName(i, elmt);

            // Append "Mark" Button
            var btnExistCheck = $(elmt).find('input.myMarkBtn');
            if (btnExistCheck.length == 0) {
                var newbtn = $(`<input type="button" class="myMarkBtn" value="X" style="${myMarkBtnCss} color: gray;"/>`);
                newbtn.click(function() {
                    var crt_label = newbtn.attr('value');

                    if (crt_label == 'cancel') {
                        newbtn.attr('value', 'X');
                        Record.remove(userID);
                        ContentVisibility.show(elmt);

                    }
                    else {
                        newbtn.attr('value', 'cancel');
                        Record.insert(userID);
                        ContentVisibility.hide(elmt);
                    }

                    setTimeout(f1, 500);
                });

                $($(elmt).find('div.reply-content__footer')[0]).append(newbtn);
            }


            // check userID whether exist in record
            if (record.includes(userID)) {
                ContentVisibility.hide(elmt);
            }
            else {
                ContentVisibility.show(elmt);
            }

            g_List.push({
                i: i,
                userID: userID,
                elmt: elmt
            });
        });
    }

    // global fold comment
    $.each($('a.more-reply'), (i, elmt) => {
        $(elmt).click(() => {
            setTimeout(() => {
                f1();
            }, 500);
        });
    });

    f1();
}

(function() {
    chrome.storage.local.get('stop', function (result) {
		if (!result.stop) {
            chrome.storage.local.get('enableEBR', function (result) {
                console.log(result);
                if (result.enableEBR) {
                    console.log('EBR enabled.');
                    EnhancedBahaReply();
                }
            });
        }
    });
})();