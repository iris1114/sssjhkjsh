
import serverUrl from "../../server/index.js";

const getRequest = (AccountId, Token, DeviceId) => {
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
                "method": "ClientVarService.GetAccountVar",
                "params": {
                    "AccountId": AccountId,
                    "Token": Token,
                    "DeviceId": DeviceId,
                    "Name": "bookmark3.0"
                }
            })
        }
    };
};

const getFetch = (AccountId, Token, DeviceId) => {
    let request = getRequest(AccountId, Token, DeviceId);
    
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
