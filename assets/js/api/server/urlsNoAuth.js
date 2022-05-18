
import serverUrl from "../../server/index.js";

const getRequest = (AssetId, MediaType, RemoteIp, DeviceId) => {
    let obj = {
        url: serverUrl.proxyServer(),
        obj: {
            method: "POST",
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json",
                "X-Forwarded-For": RemoteIp
            },
            body: JSON.stringify({
                "jsonrpc": "2.0",
                "id": 39,
                "method": "LoadService.GetURLsNoAuth",
                "params": {
                    "AssetId": AssetId,
                    "DeviceType": "pc",
                    "MediaType": MediaType,
                    "DeviceId": DeviceId
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

const getFetch = (AssetId, MediaType, RemoteIp, DeviceId) => {
    let request = getRequest(AssetId, MediaType, RemoteIp, DeviceId);
    
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

let getRequest = (AssetId, MediaType, RemoteIp, DeviceId) => {
    if(RemoteIp == "127.0.0.1" || RemoteIp == "localhost"){
        RemoteIp = "127.21.100.76";
    }

    return {
        headers: {
            "X-Forwarded-For": RemoteIp
        },
        method: "post",
        url: serverUrl.proxyServer(),
        data: {
            "jsonrpc": "2.0",
            "id": 39,
            "method": "LoadService.GetURLsNoAuth",
            "params": {
                "AssetId": AssetId,
                "DeviceType": "mobile",
                "MediaType": MediaType,
                "DeviceId": DeviceId
            }
        }
    }
};

let getAxios = (AssetId, MediaType, RemoteIp, DeviceId) => {
    return axios(getRequest(AssetId, MediaType, RemoteIp, DeviceId)).then((response) => {
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