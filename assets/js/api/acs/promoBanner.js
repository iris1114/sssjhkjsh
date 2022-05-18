
const getRequest = (contentId, contentType) => {
    let config = litv.config;

    return {
        url: `${config.acsServer}/ads/v1/promo_banner?project_num=${config.projectNum}&content_id=${contentId}&content_type=${contentType}`,
        obj: {
            method: "GET",
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "text/plain"
            }
        }
    };
};

const getFetch = (contentId, contentType) => {
    let request = getRequest(contentId, contentType);

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

let getRequest = (contentId, contentType) => {
    let config = litv.config;

    return {
        method: "get",
        url: config.acsServer + "/ads/v1/promo_banner?project_num=" + config.projectNum + "&content_id=" + contentId + "&content_type=" + contentType
    }
};

let getAxios = (contentId, contentType) => {
    return axios(getRequest(contentId, contentType)).then((response) => {
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