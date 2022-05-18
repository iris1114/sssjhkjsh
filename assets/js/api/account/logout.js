

const getRequest = () => {
    return {
        url: "/api/logout",
        obj: {
            method: "POST",
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
        return response.text();
    }).catch((err) => {
        throw err;
    });
};

const app = {
    getRequest: getRequest, 
    getFetch: getFetch
};

export default app;
