
import _ from "lodash";

import getAdUrlReplacement from "../getAdUrlReplacement.js";

const app = (programInfo, url, remoteIp, element) => {
    let _programInfo = _.cloneDeep(programInfo);
    let obj = {};

    obj.autoPlay = true;
    obj.src = url.AssetURLs[0];

    if(_programInfo.content_type != "channel"){
        let vodChannelSchedule = _programInfo.vod_channel_schedule;

        obj.startTime = vodChannelSchedule.time;
    }

    if(obj.startTime){
        obj.startTime = parseInt(obj.startTime);
    }
    else{
        obj.startTime = 0;
    }

    obj.liadMeta = _programInfo.liad;

    if(!obj.liadMeta){
        obj.liadMeta = {};
    }

    obj.playAds = url.PlayAds;

    if(_programInfo.content_type == "channel"){
        obj.assetId = _programInfo.content_id;
    }
    else{
        let vodChannelSchedule = _programInfo.vod_channel_schedule;
        let focusProgram = vodChannelSchedule.focus_program;

        obj.assetId = focusProgram.asset_id;
    }

    if(_programInfo.content_type != "channel"){
        let vodChannelSchedule = _programInfo.vod_channel_schedule;
        let focusProgram = vodChannelSchedule.focus_program;
        
        obj.midrollTimeCodes = focusProgram.time_codes;
        obj.midrollTimecodeDuration = focusProgram.timecode_duration;
    }

    if(_programInfo.content_type == "playout-channel"){
        let vodChannelSchedule = _programInfo.vod_channel_schedule;
        let focusProgram = vodChannelSchedule.focus_program;

        obj.programEndTime = focusProgram.p_end;
    }

    if(_programInfo.content_type == "channel"){
        obj.mediaMode = "live";
    }
    else if(_programInfo.content_type == "vod-channel" || _programInfo.content_type == "playout-channel"){
        obj.mediaMode = "simulation_live";
    }

    obj.keepPlayingAd = false;

    if(_programInfo.content_type != "channel"){
        let vodChannelSchedule = _programInfo.vod_channel_schedule;

        obj.midrollBeforeStart = vodChannelSchedule.midroll_before_start;
        obj.midrollBeforeStartDuration = vodChannelSchedule.midroll_before_start_duration;
    }

    obj.adUrlReplacement = getAdUrlReplacement(_programInfo, remoteIp, element);

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
