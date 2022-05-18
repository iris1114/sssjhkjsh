
import serverUrl from "../../server/index.js";

const getRequest = (contentType) => {
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
                "id": 26,
                "method": "CCCService.GetMenu",
                "params": {
                    "version": "2.0",
                    "device_id": litv.deviceId,
                    "project_num": config.projectNum,
                    "swver": config.swver,
                    "content_type": contentType
                }
            })
        },
        retries: 3,
        retryDelay: 100
    };
};

const getFetch = (contentType) => {
    let request = getRequest(contentType);
    
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
