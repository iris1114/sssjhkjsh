
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
            "method": "modify_purchase",
            "params": {
                "token": "[token]",
                "software_version": config.swver,
                "user_agent": "[Macintosh; Intel Mac OS X 10_11_6]",
                "browser_type": "[Macintosh; Intel Mac OS X 10_11_6]",
                "purchase_id": "[PUR20171200000254]",
                "purchase_info": {
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
                        "remarks": "[remarks]"
                    }
                }
            }
        })
    };

    let body = JSON.parse(obj.body);
    let params = body.params;
    let purchaseInfo = params.purchase_info;
    let order = purchaseInfo.order;

    params.Token = req.Token;
    params.user_agent = req.UserAgent;
    params.browser_type = req.BrowserType;
    params.purchase_id = req.purchaseId;

    order.orderName = req.Order.OrderName;
    order.orderPhoneNumber = req.Order.OrderPhoneNumber;
    order.orderAddress = req.Order.OrderAddress;
    order.orderEmail = req.Order.OrderEmail;
    order.orderPostal = req.Order.OrderPostal;
    order.orderCounty = req.Order.OrderCounty;
    order.orderDistrict = req.Order.OrderDistrict;
    order.receiverName = req.Order.ReceiverName;
    order.receiverPhoneNumber = req.Order.ReceiverPhoneNumber;
    order.receiverAddress = req.Order.ReceiverAddress;
    order.receiverEmail = req.Order.ReceiverEmail;
    order.receiverPostal = req.Order.ReceiverPostal;
    order.receiverCounty = req.Order.ReceiverCounty;
    order.receiverDistrict = req.Order.ReceiverDistrict;
    order.remarks = req.Order.Remarks;

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
