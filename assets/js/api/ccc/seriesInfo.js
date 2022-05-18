
import serverUrl from "../../server/index.js";

const getRequest = (contentId) => {
    let config = litv.config;
    let url = serverUrl.proxyServer();

    let obj = {
        method: "POST",
        headers: {
            "Accept": "application/json, text/plain, */*",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "jsonrpc": "2.0",
            "id": 8,
            "method": "CCCService.GetSeriesInformation",
            "params": {
                "version": "2.0",
                "project_num": config.projectNum,
                "content_id": contentId,
                "device_id": litv.deviceId,
                "swver": config.swver,
                "conditions": ""
            }
        })
    };

    return {
        url: url,
        obj: obj
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
