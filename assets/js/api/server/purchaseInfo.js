
import serverUrl from "../../server/index.js";

const getRequest = (req) => {
    let config = litv.config;

    return {
        url: serverUrl.bsmServer(),
        obj: {
            method: "POST",
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "jsonrpc": "2.0",
                "id": 2,
                "method": "get_purchase_info",
                "params": {
                    "token": req.Token,
                    "client_id": req.AccountId,
                    "device_id": req.DeviceId,
                    "software_version": config.swver,
                    "user_agent": req.UserAgent,
                    "browser_type": req.BrowserType
                }
            })
        }
    };
};

let getFetch = (req) => {
    let request = getRequest(req);

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
