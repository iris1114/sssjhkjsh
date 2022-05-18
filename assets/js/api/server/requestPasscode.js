
import serverUrl from "../../server/index.js";

const getRequest = (MobileNumber, DeviceId) => {
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
                "method": "AccountService.RequestPasscode",
                "params": {
                    "MobileNumber": MobileNumber,
                    "DeviceId": DeviceId,
                    "Swver": config.swver,
                    "project_num": config.projectNum
                }
            })
        }
    };
};

const getFetch = (MobileNumber, DeviceId) => {
    let request = getRequest(MobileNumber, DeviceId);
    
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
