

"use strict";


// global default config
const BLACKLIST = "polla|[保保寶宝].?[拉拉啦啦]|p.?o.?l.?l.?a|[吉吉告告占占].?([娃娃])+|KFC|緊急通知|瑪雅與|安娜貝爾";
let g_config = {
    EnableBFP: true, 
    OpenInNewTab: true,
    FilterThumb: false,
    BlackList: BLACKLIST,
    EnableAdvReply: false,
    IMAGE_WIDTH: 200
};


function Init() {
    return new Promise((resolve, reject) => {
        console.log('loading config...');

        chrome.storage.local.get(null, function (result) {
            console.log(result);

            if (!result.config) {
                // can not load config
                console.log('load config fail.');
                console.log('reset config to default.');
                chrome.storage.local.set({config: g_config});
                resolve(g_config);
                return;
            }

            console.log('using loaded config.');
            g_config = result.config;
            resolve(g_config);
        });
    });
}