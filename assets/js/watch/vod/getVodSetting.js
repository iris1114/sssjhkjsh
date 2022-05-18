
import _ from "lodash";

import getAdUrlReplacement from "../getAdUrlReplacement.js";

const app = (programInfo, url, remoteIp, element) => {
    let _programInfo = _.cloneDeep(programInfo);
    let obj = {};

    obj.autoPlay = true;
    obj.src = url.AssetURLs[0];
    obj.startTime = programInfo.time;

    if(obj.startTime){
        obj.startTime = parseInt(obj.startTime);
    }
    else{
        obj.startTime = 0;
    }

    obj.liadMeta = _programInfo.liads;

    if(!obj.liadMeta){
        obj.liadMeta = {};
    }

    obj.playAds = url.PlayAds;
    obj.assetId = _programInfo.assets[0].asset_id;

    if(_programInfo.midroll){
        if(Array.isArray(_programInfo.midroll.time_codes)){
            obj.midrollTimeCodes = new Array();
            
            for(let i = 0; i < _programInfo.midroll.time_codes.length; i ++){
                let timeCode = _programInfo.midroll.time_codes[i];

                timeCode = timeCode * 1000;
                
                obj.midrollTimeCodes.push(timeCode);
            }
        }
    }
    
    obj.mediaMode = "vod";
    obj.keepPlayingAd = true;
    obj.adUrlReplacement = getAdUrlReplacement(_programInfo, remoteIp, element);
    
    obj.companionAdSize = [
        { 
            width: 300, 
            height: 250,
            fixed: false
        },
        { 
            width: 640,
            height: 100,
            fixed: true
        }
    ];

    if(litv.puid){
        obj.puid = litv.puid;
    }

    if(typeof __uid2 != "undefined"){
        let uid = __uid2.getAdvertisingToken();

        if(uid){
            obj.eids = {
                uid2: uid
            };
        }
    }

    return obj;
};

export default app;
