
import pako from "pako";

const getRequest = (descriptionHash) => {
    return {
        url: litv.config.vodChannelDescription + "." + descriptionHash,
        obj: {
            method: "GET",
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "text/plain"
            }
        }
    };
};

const getFetch = (descriptionHash) => {
    let request = getRequest(descriptionHash);

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

let getRequest = (descriptionHash) => {
    return {
        method: "get",
        responseType: "arraybuffer",
        url: litv.config.vodChannelDescription + "." + descriptionHash
    }
};

let getAxios = (descriptionHash) => {
    return axios(getRequest(descriptionHash)).then((response) => {
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