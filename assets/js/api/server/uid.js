
const getRequest = (AccountId, Token, DeviceId) => {
    let config = litv.config;
    
    return {
        url: `${config.pustiService}/uid2/token`,
        obj: {
            method: "POST",
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "account_id": AccountId,
                "token": Token,
                "device_id": DeviceId
            })
        }
    };
};

const getFetch = (AccountId, Token, DeviceId) => {
    let request = getRequest(AccountId, Token, DeviceId);
    
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
