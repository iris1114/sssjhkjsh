
import serverUrl from "../../server/index.js";

const getRequest = (req) => {
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
                "method": "AccountService.ResetPassword",
                "params": {
                    "MobileNumber": req.MobileNumber,
                    "Passcode": req.Passcode,
                    "NewPassword": req.NewPassword,
                    "Password": req.Password,
                    "AccountId": req.AccountId,
                    "Token": req.Token,
                    "project_num": config.projectNum,
                    "swver": config.swver
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
