
const getRequest = () => {    
    return {
        url: "https://sync.search.spotxchange.com/audience_id",
        obj: {
            method: "GET",
            credentials: "include"
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
