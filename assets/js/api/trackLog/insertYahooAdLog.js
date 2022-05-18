
import serverUrl from "../../server/index.js";

const getRequest = (adId, cdata, adClip) => {    
    let config = litv.config;

    return {
        url: serverUrl.proxyServer(),
        obj: {
            method: "POST",
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "jsonrpc": "2.0",
                "id": 71727,
                "method": "YahooService.InsertYahooAdLog",
                "params": {
                    "version": "2.0",
                    "platform": config.platform,
                    "ad_id": adId,
                    "cdata": cdata,
                    "ad_clip": adClip
                }
            })
        }
    };
};

const getFetch = (adId, cdata, adClip) => {
    let request = getRequest(adId, cdata, adClip);

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
