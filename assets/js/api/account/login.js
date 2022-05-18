
const getRequest = (User, Pass) => {
    return {
        url: "/api/login",
        obj: {
            method: "POST",
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                User: User,
                Pass: Pass
            })
        }
    };
};

const getFetch = (User, Pass) => {
    let request = getRequest(User, Pass);

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
