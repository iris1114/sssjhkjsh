

import pako from "pako";

const getRequest = (scheduleHash) => {
    return {
        url: litv.config.vodChannelSchedule + "." + scheduleHash,
        obj: {
            method: "GET",
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "text/plain"
            }
        }
    };
};

const getFetch = (scheduleHash) => {
    let request = getRequest(scheduleHash);

    return fetch(request.url, request.obj).then((response) => {
        return response.arrayBuffer();
    }).then((response) => {
        let data = new Uint8Array(response);
        
        data = pako.inflate(data, {
            to: "string"
        });
        
        data = JSON.parse(data);
        
        return data;
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
import pako from "pako";

let getRequest = (scheduleHash) => {
    return {
        method: "get",
        responseType: "arraybuffer",
        url: litv.config.vodChannelSchedule + "." + scheduleHash
    }
};

let getAxios = (scheduleHash) => {
    return axios(getRequest(scheduleHash)).then((response) => {
        let data = response.data;
        
        data = new Uint8Array(data);
        
        data = pako.inflate(data, {
            to: "string"
        });

        data = JSON.parse(data);
        
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