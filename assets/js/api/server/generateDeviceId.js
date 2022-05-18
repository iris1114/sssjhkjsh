
import serverUrl from "../../server/index.js";

const getRequest = (MobileNumber) => {
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
                "method": "AccountService.GenerateDeviceId",
                "params": {
                    "MobileNumber": MobileNumber,
                    "Swver": config.swver,
                    "project_num": config.projectNum
                }
            })
        }
    };
};

const getFetch = (MobileNumber) => {
    let request = getRequest(MobileNumber);
    
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
