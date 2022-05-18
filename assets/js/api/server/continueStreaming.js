
import serverUrl from "../../server/index.js";

const getRequest = (AccountId, Token, DeviceId, SessionId) => {
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
                "method": "LoadService.ContinueStreaming",
                "params": {
                    "AccountId": AccountId,
                    "Token": Token,
                    "DeviceId": DeviceId,
                    "SessionId": SessionId
                }
            })
        }
    };
};

let getFetch = (AccountId, Token, DeviceId, SessionId) => {
    let request = getRequest(AccountId, Token, DeviceId, SessionId);
    
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

let getRequest = (AccountId, Token, DeviceId, SessionId) => {
    return {
        method: "post",
        url: serverUrl.proxyServer(),
        data: {
            "jsonrpc": "2.0",
            "id": 26,
            "method": "LoadService.ContinueStreaming",
            "params": {
                "AccountId": AccountId,
                "Token": Token,
                "DeviceId": DeviceId,
                "SessionId": SessionId
            }
        }
    }
};

let getAxios = (AccountId, Token, DeviceId, SessionId) => {
    return axios(getRequest(AccountId, Token, DeviceId, SessionId)).then((response) => {
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