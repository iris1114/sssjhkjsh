
import serverUrl from "../../server/index.js";

const getRequest = (req) => {
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
                "method": "ClientVarService.SetAccountVar",
                "params": {
                    "AccountId": req.AccountId,
                    "Token": req.Token,
                    "DeviceId": req.DeviceId,
                    "Name": "bookmark3.0",
                    "Value": req.Value
                }
            })
        }
    };
};

const getFetch = (req) => {
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
