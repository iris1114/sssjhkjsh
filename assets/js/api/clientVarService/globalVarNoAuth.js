
import serverUrl from "../../server/index.js";

const getRequest = () => {
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
                "id": 14,
                "method": "ClientVarService.GetGlobalVarNoAuth",
                "params": {
                    "DeviceId": litv.deviceId,
                    "Name": "bookmarkamount"
                }
            })
        }
    };
};

const getFetch = () => {
    let request = getRequest();
    
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
