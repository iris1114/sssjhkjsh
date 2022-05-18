
const getRequest = (Value) => {
    return {
        url: "/api/setAccountVar",
        obj: {
            method: "POST",
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                Value: Value
            })
        }
    };
};

const getFetch = (Value) => {
    let request = getRequest(Value);

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
