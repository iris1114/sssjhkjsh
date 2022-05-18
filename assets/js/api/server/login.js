
import serverUrl from "../../server/index.js";

const getRequest = (User, Pass, DeviceId) => {
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
                "method": "AccountService.Login",
                "params": {
                    "User": User,
                    "Pass": Pass,
                    "DeviceId": DeviceId,
                    "Swver": config.swver,
                    "ModelInfo": "",
                    "project_num": config.projectNum
                }
            })
        }
    };
};

const getFetch = (User, Pass, DeviceId) => {
    let request = getRequest(User, Pass, DeviceId);
    
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
