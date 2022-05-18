
const getRequest = (req) => {
    return {
        url: "/api/register",
        obj: {
            method: "POST",
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                MobileNumber: req.MobileNumber,
                ReferringPartner: req.ReferringPartner,
                Captcha: req.Captcha,
                CustomerInformation: {
                    BirthYear: req.CustomerInformation.BirthYear,
                    EmailAddress: req.CustomerInformation.EmailAddress,
                    Sex: req.CustomerInformation.Sex
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
