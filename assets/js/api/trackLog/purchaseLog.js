
const getRequest = (obj, UserAgent) => {
    let config = litv.config;
    let message = {};

    if(UserAgent){
        message.user_agant = UserAgent;
    }
    else if(navigator){
        message.user_agant = navigator.userAgent;
    }

    message.result_code = obj.result_code;
    message.session_uid = obj.session_uid;

    if(obj.purchase_id && obj.purchase_list.length > 0){
        message.date = new Date(obj.purchase_list[0].purchase_datetime).getTime();
        message.purchase_id = obj.purchase_id;
        message.package_id = obj.purchase_list[0].details[0].package_id;
        message.pay_type = obj.purchase_list[0].pay_type;
        message.promo_code = obj.purchase_list[0].promo_code;
        message.recurrent = obj.purchase_list[0].recurrent;
    }

    return {
        url: config.purchaseLog,
        obj: {
            method: "POST",
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "platform": config.platform,
                "client_datetime": new Date().getTime(),
                "message": message
            })
        }
    };
};

const getFetch = (obj, UserAgent) => {
    let request = getRequest(obj, UserAgent);

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
