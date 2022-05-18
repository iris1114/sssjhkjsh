
import serverUrl from "../../server/index.js";
import tools from "../../tools/index.js";
import api from "../index.js";

const getRequest = (contentId) => {
    let config = litv.config;
    let referringPartner = tools.url.getReferringPartner();
    
    return {
        url: serverUrl.proxyServer(),
        obj: {
            method: "POST",
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "jsonrpc": "2.0",
                "id": 12,
                "method": "CCCService.GetProgramInformation",
                "params": {
                    "version": "3.0",
                    "content_id": contentId,
                    "device_id": litv.deviceId,
                    "project_num": config.projectNum,
                    "swver": config.swver,
                    "conditions": "",
                    "browser_type": referringPartner
                }
            })
        }
    };
};

const getFetch = (contentId) => {
    let request = getRequest(contentId);

    let vodScheduleFetch = api.acs.vodSchedule.getFetch(contentId)

    let programInfoFetch = fetch(request.url, request.obj).then((response) => {
        return response.json();
    }).catch((err) => {
        throw err;
    });

    return Promise.all([vodScheduleFetch, programInfoFetch]).then((response) => {
        let vodSchedule = response[0];
        let programInfo = response[1];

        if(programInfo.result){
            programInfo.result.data.schedule_info = vodSchedule;
        }
        
        return programInfo;
    }).catch((err) => {
        throw err;
    });
};

const app = {
    getRequest: getRequest,
    getFetch: getFetch
};

export default app;
