

const getRequest = (NewPassword) => {
    return {
        url: "/api/resetPasswordByPasscode",
        obj: {
            method: "POST",
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                NewPassword: NewPassword
            })
        }
    };
};

const getFetch = (NewPassword) => {
    let request = getRequest(NewPassword);

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
