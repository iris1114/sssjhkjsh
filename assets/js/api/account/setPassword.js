
const getRequest = (Password, NewPassword) => {
    return {
        url: "/api/setPassword",
        obj: {
            method: "POST",
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                Password: Password,
                NewPassword: NewPassword
            })
        }
    };
};

const getFetch = (Password, NewPassword) => {
    let request = getRequest(Password, NewPassword);

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
