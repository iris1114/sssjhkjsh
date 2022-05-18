
const getRequest = () => {
    let config = litv.config;
    
    return {
        url: `${config.pustiService}/queryAds`,
        obj: {
            method: "GET",
            credentials: "include",
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json"
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
