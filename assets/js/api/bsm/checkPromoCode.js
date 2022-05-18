
const getRequest = (PackageId, PromoCode) => {
    return {
        url: "/api/checkPromoCode",
        obj: {
            method: "POST",
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                PackageId: PackageId,
                PromoCode: PromoCode
            })
        }
    };
};

const getFetch = (PackageId, PromoCode) => {
    let request = getRequest(PackageId, PromoCode);

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
