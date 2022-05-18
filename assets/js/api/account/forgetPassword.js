

const getRequest = (MobileNumber, Captcha) => {
    return {
        url: "/api/forgetPassword",
        obj: {
            method: "POST",
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                MobileNumber: MobileNumber,
                Captcha: Captcha
            })
        }
    };
};

const getFetch = (MobileNumber, Captcha) => {
    let request = getRequest(MobileNumber, Captcha);

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
