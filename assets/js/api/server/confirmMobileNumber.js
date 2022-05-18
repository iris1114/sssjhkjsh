
import serverUrl from "../../server/index.js";

const getRequest = (MobileNumber, DeviceId, Passcode) => {
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
                "method": "AccountService.ConfirmMobileNumber",
                "params": {
                    "Swver": config.swver,
                    "Passcode": Passcode,
                    "DeviceId": DeviceId,
                    "MobileNumber": MobileNumber,
                    "ModelInfo": null
                }
            })
        }
    };
};

const getFetch = (MobileNumber, DeviceId, Passcode) => {
    let request = getRequest(MobileNumber, DeviceId, Passcode);
    
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
