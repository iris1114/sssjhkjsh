
import pako from "pako";

const getRequest = () => {
    return {
        url: litv.config.scheduleAllWithMediumPrograms,
        obj: {
            method: "GET",
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "text/plain"
            }
        }
    };
};

const getFetch = () => {
    let request = getRequest();

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

let getRequest = () => {
    return {
        method: "get",
        responseType: "arraybuffer",
        url: litv.config.scheduleAllWithMediumPrograms
    }
};

let getAxios = () => {
    return axios(getRequest()).then((response) => {
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