
const getRequest = (puid) => {
    let config = litv.config;

    return {
        url: `${config.taiwanmediaServer}/taiwan-media/puid/sync?luid=${puid}`,
        obj: {
            method: "GET",
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "text/plain"
            }
        }
    };
};

const getFetch = (puid) => {
    let request = getRequest(puid);

    return fetch(request.url, request.obj);
};

const app = {
    getRequest: getRequest, 
    getFetch: getFetch
};

export default app;
