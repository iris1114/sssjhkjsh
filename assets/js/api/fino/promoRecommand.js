
const getRequest = (seriesId) => {
    return {
        url: litv.config.fino + "/frontpage/vod/" + seriesId + "_promo_recommend.json",
        obj: {
            method: "GET",
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "text/plain"
            }
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

let getRequest = (seriesId) => {
    return {
        method: "get",
        url: litv.config.fino + "/frontpage/vod/" + seriesId + "_promo_recommend.json"
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