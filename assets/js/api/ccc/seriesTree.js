
import serverUrl from "../../server/index.js";

const getRequest = (seriesId) => {
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
                "id": 13,
                "method": "CCCService.GetSeriesTree",
                "params": {
                    "version": "2.0",
                    "device_id": litv.deviceId,
                    "project_num": config.projectNum,
                    "swver": config.swver,
                    "series_id": seriesId,
                    "conditions": ""
                }
            })
        }
    };
};

const getFetch = (seriesId) => {
    let request = getRequest(seriesId);
    
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
