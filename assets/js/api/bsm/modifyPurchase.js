
const getRequest = (req) => {
    return {
        url: "/api/modifyPurchase",
        obj: {
            method: "POST",
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                purchaseId: req.purchaseId,
                Order: {
                    OrderName: req.Order.OrderName,
                    OrderPhoneNumber: req.Order.OrderPhoneNumber,
                    OrderAddress: req.Order.OrderAddress,
                    OrderEmail: req.Order.OrderEmail,
                    OrderPostal: req.Order.OrderPostal,
                    OrderCounty: req.Order.OrderCounty,
                    OrderDistrict: req.Order.OrderDistrict,
                    ReceiverName: req.Order.ReceiverName,
                    ReceiverPhoneNumber: req.Order.ReceiverPhoneNumber,
                    ReceiverAddress: req.Order.ReceiverAddress,
                    ReceiverEmail: req.Order.ReceiverEmail,
                    ReceiverPostal: req.Order.ReceiverPostal,
                    ReceiverCounty: req.Order.ReceiverCounty,
                    ReceiverDistrict: req.Order.ReceiverDistrict,
                    Remarks: req.Order.Remarks
                }
            })
        }
    };
};

const getFetch = (req) => {
    let request = getRequest(req);

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
