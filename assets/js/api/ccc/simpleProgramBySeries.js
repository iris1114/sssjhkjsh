
import serverUrl from "../../server/index.js";

const getRequest = (req) => {
    let config = litv.config;
    
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
                "id": 24,
                "method": "CCCService.GetSimpleProgramBySeries",
                "params": {
                    "version": "2.0",
                    "project_num": config.projectNum,
                    "device_id": litv.deviceId,
                    "swver": config.swver,
                    "conditions": "",
                    "series_id": req.series_id,
                    "season": req.season,
                    "episode": req.episode,
                    "video_type": req.video_type,
                    "group_id": req.group_id
                }
            })
        }
    };
};

const getFetch = (req) => {
    let request = getRequest(req);
    
    return fetch(request.url, request.obj).then((response) => {
        return response.json();
    }).catch((err) => {
        throw err;
    });
};

const app = {
    getRequest: getRequest, 
    getFetch: getFetch
};

export default app;
