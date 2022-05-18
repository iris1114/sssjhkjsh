
const getRequest = (AccountId, DeviceId, Token) => {
    let config = litv.config;

    return {
        url: `${config.accinfoServer}/lambda/getAccountInfo`,
        obj: {
            method: "POST",
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "jsonrpc": "2.0",
                "id": 53,
                "method": "getNotices",
                "params": {
                    "project_no": config.projectNum,
                    "client_id": AccountId,
                    "device_id": DeviceId,
                    "token": Token,
                    "frame_id": "PC_dialog_index_ValidTime"
                }
            })
        }
    };
};

const getFetch = (AccountId, DeviceId, Token) => {
    let request = getRequest(AccountId, DeviceId, Token);
    
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
