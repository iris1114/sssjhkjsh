
const getRequest = (AssetId, MediaType) => {
    return {
        url: "/api/urls",
        obj: {
            method: "POST",
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                AssetId: AssetId,
                MediaType: MediaType
            })
        }
    };
};

const getFetch = (AssetId, MediaType) => {
    let request = getRequest(AssetId, MediaType);

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

let getRequest = (AssetId, MediaType) => {
    return {
        method: "post",
        url: "/api/urls",
        data: {
            AssetId: AssetId,
            MediaType: MediaType
        }
    }
};

let getAxios = (AssetId, MediaType) => {
    return axios(getRequest(AssetId, MediaType)).then((response) => {
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