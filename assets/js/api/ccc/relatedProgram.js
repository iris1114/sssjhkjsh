
import serverUrl from "../../server/index.js";

const getRequest = (contentId) => {
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
                "method": "CCCService.GetRelatedProgram",
                "params": {
                    "version": "2.0",
                    "content_id": contentId,
                    "device_id": litv.deviceId,
                    "project_num": config.projectNum,
                    "swver": config.swver,
                    "conditions": ""
                }
            })
        }
    };
};

const getFetch = (contentId) => {
    let request = getRequest(contentId);
    
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
