
const getRequest = (req) => {
    return {
        url: "/api/webPurchase",
        obj: {
            method: "POST",
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                PurchaseInfo: {
                    SessionUid: req.PurchaseInfo.SessionUid,
                    PayType: req.PurchaseInfo.PayType,
                    CardType: req.PurchaseInfo.CardType,
                    CardNumber: req.PurchaseInfo.CardNumber,
                    CardExpiry: req.PurchaseInfo.CardExpiry,
                    Cvc2: req.PurchaseInfo.Cvc2,
                    InvoiceGiftFlg: req.PurchaseInfo.InvoiceGiftFlg,
                    Details: {
                        PackageId: req.PurchaseInfo.Details.PackageId,
                        ItemId: req.PurchaseInfo.Details.ItemId,
                        OptionPackageId: req.PurchaseInfo.Details.OptionPackageId
                    },
                    Extra: {
                        QueryString: req.PurchaseInfo.Extra.QueryString
                    },
                    PromoCode: req.PurchaseInfo.PromoCode
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
