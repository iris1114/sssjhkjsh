
import serverUrl from "../../server/index.js";

const getRequest = (req) => {
    let obj = {
        url: serverUrl.proxyServer(),
        obj: {
            method: "POST",
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json",
                "X-Forwarded-For": req.RemoteIp
            },
            body: JSON.stringify({
                "jsonrpc": "2.0",
                "id": 26,
                "method": "LoadService.GetURLs",
                "params": {
                    "AccountId": req.AccountId,
                    "MediaType": req.MediaType,
                    "DeviceId": req.DeviceId,
                    "Token": req.Token,
                    "DeviceType": "pc",
                    "AssetId": req.AssetId
                }
            })
        }
    };

    let headers = obj.obj.headers;

    if(headers["X-Forwarded-For"] == "127.0.0.1" || headers["X-Forwarded-For"] == "localhost"){
        headers["X-Forwarded-For"] = "127.21.100.74";
    }

    return obj;
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
/*
import axios from "axios";

import serverUrl from "../../assets/js/server/index.js";

let getRequest = (req) => {
    let obj = {
        headers: {
            "X-Forwarded-For": "127.0.0.1"
        },
        method: "post",
        url: serverUrl.proxyServer(),
        data: {
            "jsonrpc": "2.0",
            "id": 47,
            "method": "LoadService.GetURLs",
            "params": {
                "AccountId": "2A002D2FC2F6ECDF",
                "MediaType": "channel",
                "DeviceId": "B0180E092D28",
                "Token": "eef7fe05f452f882ada5a3a32e455c14e8ad0700",
                "DeviceType": "mobile",
                "AssetId": "4gtv-4gtv003"
            }
        }
    };

    let headers = obj.headers;

    headers["X-Forwarded-For"] = req.RemoteIp;

    if(headers["X-Forwarded-For"] == "127.0.0.1" || headers["X-Forwarded-For"] == "localhost"){
        headers["X-Forwarded-For"] = "127.21.100.74";
    }

    let data = obj.data;
    let params = data.params;

    params.AccountId = req.AccountId;
    params.MediaType = req.MediaType;
    params.DeviceId = req.DeviceId;
    params.Token = req.Token;
    params.AssetId = req.AssetId;
    
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