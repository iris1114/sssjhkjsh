
import serverUrl from "../../server/index.js";

const getRequest = (req) => {
    let config = litv.config;

    let url = serverUrl.bsmServer();

    let obj = {
        method: "POST",
        headers: {
            "Accept": "application/json, text/plain, */*",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "jsonrpc": "2.0",
            "id": 2,
            "method": "web_purchase",
            "params": {
                "token": "[token]",
                "software_version": config.swver,
                "user_agent": "[Macintosh; Intel Mac OS X 10_11_6]",
                "browser_type": "[Macintosh; Intel Mac OS X 10_11_6]",
                "purchase_info": {
                    "session_uid": "[20190912081006984ka6a6qx3r5]",
                    "pay_type": "[CREDIT]",
                    "card_type": "[VISA/MASTER/JCB]",
                    "card_number": "[1234123412341234]",
                    "card_expiry": "[202012]",
                    "Cvc2": "[123]",
                    "client_id": "[2A00DB524C6239EA]",
                    "device_id": "[98E79A30C310]",
                    "invoice_gift_flg": "[true/false]",
                    "details": [
                        {
                            "package_id": "[W00005]",
                            "item_id": "[VOD00156172]"
                        },
                        {
                            "package_id": "[PRO11]"
                        }
                    ],
                    "order": {
                        "orderName": "[name]",
                        "orderPhoneNumber": "[0999559990]",
                        "orderAddress": "[orderAddress]",
                        "orderEmail": "[orderEmail]",
                        "orderPostal": "[orderPostal]",
                        "orderCounty": "[orderCounty]",
                        "orderDistrict": "[orderDistrict]",
                        "receiverName": "[receiverName]",
                        "receiverPhoneNumber": "[receiverPhoneNumber]",
                        "receiverAddress": "[receiverAddress]",
                        "receiverEmail": "[receiverEmail]",
                        "receiverPostal": "[receiverPostal]",
                        "receiverCounty": "[receiverCounty]",
                        "receiverDistrict": "[receiverDistrict]",
                        "remarks": "[remarks]",
                        "society": "[society]",
                        "workPlace": "[workPlace]",
                        "birthday": "[birthday]"
                    },
                    "extra": {
                        "querystring": "[id=ALL]"
                    },
                    "promo_code": "[VIP888]"
                },
                "cht_params": {
                    "aa-result": "[????]",
                    "aa-uid": "[????]",
                    "aa-otpw": "[????]",
                    "aa-fee": "[????]",
                    "aa-authority": "[????]",
                    "aa-others": "[????]",
                    "aa-cporderno": "[????]",
                    "ApproveCode": "[????]",
                    "PAN": "[????]",
                    "packageId": "[W00005]",
                    "oriPayment": "[????]",
                    "aa-errorCode": "[????]",
                    "BankCode": "[????]",
                    "itemId": "[????]",
                    "sessionId": "[sessionId]"
                }
            }
        })
    };

    let body = JSON.parse(obj.body);
    let params = body.params;

    params.Token = req.Token;
    params.user_agent = req.UserAgent;
    params.browser_type = req.BrowserType;

    params.purchase_info.session_uid = req.PurchaseInfo.SessionUid;
    params.purchase_info.pay_type = req.PurchaseInfo.PayType;
    params.purchase_info.card_type = req.PurchaseInfo.CardType;
    params.purchase_info.card_number = req.PurchaseInfo.CardNumber;
    params.purchase_info.card_expiry = req.PurchaseInfo.CardExpiry;
    params.purchase_info.Cvc2 = req.PurchaseInfo.Cvc2;
    params.purchase_info.client_id = req.PurchaseInfo.AccountId;
    params.purchase_info.device_id = req.PurchaseInfo.DeviceId;
    params.purchase_info.invoice_gift_flg = req.PurchaseInfo.InvoiceGiftFlg;

    params.purchase_info.details[0].package_id = req.PurchaseInfo.Details.PackageId;
    params.purchase_info.details[0].item_id = req.PurchaseInfo.Details.ItemId;
    params.purchase_info.details[1].package_id = req.PurchaseInfo.Details.OptionPackageId;

    params.purchase_info.details = params.purchase_info.details.filter((element) => {
        if(element.package_id){
            return true;
        }

        return false;
    });

    params.purchase_info.extra.querystring = req.PurchaseInfo.Extra.QueryString

    params.purchase_info.promo_code = req.PurchaseInfo.PromoCode;

    delete params.purchase_info.order
    delete params.cht_params;

    obj.body = JSON.stringify(body);

    return {
        url: url,
        obj: obj
    };
};

let getFetch = (req) => {
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
