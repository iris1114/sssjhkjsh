

const getRequest = (PromoCode) => {
    return {
        url: "/api/promoUse",
        obj: {
            method: "POST",
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                PromoCode: PromoCode
            })
        }
    };
};

const getFetch = (PromoCode) => {
    let request = getRequest(PromoCode);

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

let getRequest = (PromoCode) => {
    return {
        method: "post",
        url: "/api/promoUse",
        data: {
            PromoCode: PromoCode
        }
    }
};

let getAxios = (PromoCode) => {
    return axios(getRequest(PromoCode)).then((response) => {
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