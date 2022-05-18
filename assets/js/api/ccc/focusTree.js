

import serverUrl from "../../server/index.js";

const getRequest = (seriesId) => {
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
                "id": 5,
                "method": "CCCService.GetFocusTree",
                "params": {
                    "version": "2.0",
                    "project_num": config.projectNum,
                    "series_id": seriesId
                }
            })
        }
    };
};

const getFetch = (seriesId) => {
    let request = getRequest(seriesId);
    
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

import serverUrl from "~/assets/js/server/index.js";

let getRequest = (seriesId) => {
    let config = litv.config;
    
    return {
        method: "post",
        url: serverUrl.proxyServer(),
        data: {
            "jsonrpc": "2.0",
            "id": 13,
            "method": "CCCService.GetFocusTree",
            "params": {
                "version": "2.0",
                "project_num": config.projectNum,
                "series_id": seriesId
              }
        }
    }
};

let getAxios = (seriesId) => {
    return axios(getRequest(seriesId)).then((response) => {
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