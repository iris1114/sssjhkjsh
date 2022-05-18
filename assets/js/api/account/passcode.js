
const getRequest = (Passcode) => {
    return {
        url: "/api/passcode",
        obj: {
            method: "POST",
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                Passcode: Passcode
            })
        }
    };
};

const getFetch = (Passcode) => {
    let request = getRequest(Passcode);

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
