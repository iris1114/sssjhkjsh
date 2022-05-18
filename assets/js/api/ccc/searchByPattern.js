
import serverUrl from "../../server/index.js";

const getRequest = (pattern) => {
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
                "method": "CCCService.SearchByPattern",
                "params": {
                    "version": "2.0",
                    "device_id": litv.deviceId,
                    "project_num": config.projectNum,
                    "pattern": pattern,
                    "swver": config.swver
                }
            })
        }
    };
};

const getFetch = (pattern) => {
    let request = getRequest(pattern);
    
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
