
import serverUrl from "../../server/index.js";

const getRequest = (ruleId) => {    
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
                "method": "CCCService.GetPlayList",
                "params": {
                    "version": "2.0",
                    "rule_id": ruleId
                }
            })
        }
    };
};

const getFetch = (ruleId) => {
    let request = getRequest(ruleId);
    
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
