
import serverUrl from "../../server/index.js";

const getRequest = (contentIds) => {
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
                "id": 5,
                "method": "CCCService.GetBulkSimpleProgram",
                "params": {
                    "version": "2.0",
                    "project_num": config.projectNum,
                    "device_id": litv.deviceId,
                    "swver": config.swver,
                    "content_id_list": contentIds
                }
            })
        }
    };
};

const getFetch = (contentIds) => {
    let request = getRequest(contentIds);
    
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
