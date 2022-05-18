
const getRequest = (SessionId) => {
    return {
        url: "/api/continueStreaming",
        obj: {
            method: "POST",
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                SessionId: SessionId
            })
        }
    };
};

const getFetch = (SessionId) => {
    let request = getRequest(SessionId);

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

let getRequest = (SessionId) => {
    return {
        method: "post",
        url: "/api/continueStreaming",
        data: {
            SessionId: SessionId
        }
    }
};

let getAxios = (SessionId) => {
    return axios(getRequest(SessionId)).then((response) => {
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