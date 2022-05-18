
const getRequest = (puid) => {
    let config = litv.config;
    
    return {
        url: `${config.pustiService}/puid`,
        obj: {
            method: "POST",
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "jsonrpc": "2.0",
                "id": 100,
                "method": "PustiService.PUID",
                "params": {
                    "version": "2.0",
                    "device_id": litv.deviceId,
                    "device_category": config.projectNum,
                    "puid": puid,
                    "aaid": "",
                    "idfa": ""
                }
            })
        }
    };
};

const getFetch = (puid) => {
    let request = getRequest(puid);
    
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
