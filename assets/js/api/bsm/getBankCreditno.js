
import serverUrl from "../../server/index.js";

const getRequest = (bankCode) => {
    return {
        url: serverUrl.bsmApiServer(),
        obj: {
            method: "POST",
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "jsonrpc": "2.0",
                "id": 2,
                "method": "get_bank_creditno",
                "params": {
                    "bank_code": bankCode
                }
            })
        }
    };
};

let getFetch = (bankCode) => {
    let request = getRequest(bankCode);

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
