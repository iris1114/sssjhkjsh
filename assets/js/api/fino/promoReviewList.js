
const getRequest = () => {
    return {
        url: litv.config.fino + "/frontpage/vod/promo_review_list.json",
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

let getRequest = () => {
    return {
        method: "get",
        url: litv.config.fino + "/frontpage/vod/promo_review_list.json"
    }
};

let getAxios = () => {
    return axios(getRequest()).then((response) => {
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