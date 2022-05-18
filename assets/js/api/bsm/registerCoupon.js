
const getRequest = (CouponNo) => {
    return {
        url: "/api/registerCoupon",
        obj: {
            method: "POST",
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                CouponNo: CouponNo
            })
        }
    };
};

const getFetch = (CouponNo) => {
    let request = getRequest(CouponNo);

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
