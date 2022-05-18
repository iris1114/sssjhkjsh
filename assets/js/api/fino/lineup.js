
const getRequest = (bsmPackageCategory) => {
    let config = litv.config;

    return {
        url: `${config.fino}/litvpc/lineup${bsmPackageCategory}.json`,
        obj: {
            method: "GET",
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "text/plain"
            }
        }
    };
};

const getFetch = (bsmPackageCategory) => {
    let request = getRequest(bsmPackageCategory);

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
