
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
                "method": "AccountService.Register",
                "params": {
                    "Swver": config.swver,
                    "Passcode": req.Passcode,
                    "CustomerInformation": {
                        "BirthYear": req.CustomerInformation.BirthYear,
                        "EmailAddress": req.CustomerInformation.EmailAddress,
                        "RealName": req.CustomerInformation.RealName,
                        "MailingAddress": req.CustomerInformation.MailingAddress,
                        "Sex": req.CustomerInformation.Sex,
                        "Password": req.CustomerInformation.Password,
                        "PostalCode": req.CustomerInformation.PostalCode,
                        "AltPhone": req.CustomerInformation.AltPhone,
                    },
                    "DeviceId": req.DeviceId,
                    "MobileNumber": req.MobileNumber,
                    "project_num": config.projectNum,
                    "ReferringPartner": req.ReferringPartner
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
