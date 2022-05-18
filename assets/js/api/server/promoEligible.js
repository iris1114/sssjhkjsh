
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
                "id": 2,
                "method": "AccountService.PromoEligible",
                "params": {
                    "Swver": config.swver,
                    "project_num": config.projectNum,
                    "AccountId": req.AccountId,
                    "Token": req.Token,
                    "PromoCode": req.PromoCode,
                    "DeviceId": req.DeviceId,
                    "ModelInfo": req.ModelInfo
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

/*
import axios from "axios";

import serverUrl from "../../assets/js/server/index.js";

let getRequest = (req) => {
    let config = litv.config;

    let obj = {
        method: "post",
        url: serverUrl.proxyServer(),
        data: {
            "jsonrpc": "2.0",
            "id": 26,
            "method": "AccountService.PromoEligible",
            "params": {
                "Swver": config.swver,
                "project_num": config.projectNum,
                "AccountId": null,
                "Token": null,
                "PromoCode": null,
                "DeviceId": null,
                "ModelInfo": null
            }
        }
    }

    let data = obj.data;
    let params = data.params;

    params.AccountId = req.AccountId;
    params.Token = req.Token;
    params.PromoCode = req.PromoCode;
    params.DeviceId = req.DeviceId;
    params.ModelInfo = req.ModelInfo;
    
    return obj;
};

let getAxios = (req) => {
    return axios(getRequest(req)).then((response) => {
        let data = response.data;

        return data;
    }).catch((err) => {
        throw err;
    });
};

export default {
    getRequest: getRequest,
    getAxios: getAxios
};
*/