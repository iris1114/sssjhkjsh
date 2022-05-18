
import aes128 from "../../assets/js/hash/aes128.js";
import tools from "../../assets/js/tools/index.js";
import api from "../../assets/js/api/index.js";

const app = async (req, res, next) => {
    if(req.method != "POST"){
        res.writeHead(400, "Bad Request");
        res.end();

        return;
    }

    let head = [
        ["Content-Type", "application/json"]
    ];

    let env = process.env.NEXT_PUBLIC_ENV;

    if(env == "development"){
        head.push(
            ["Access-Control-Allow-Origin", req.headers.origin],
            ["Access-Control-Allow-Credentials", true]
        );
    }

    let body = "";

    try{
        let post = req.body;

        if(typeof post == "string"){
            post = JSON.parse(post);
        }

        let cookies = tools.parseCookies(req);
        let AccountId = aes128.decrypt(cookies.l_ac);
        let DeviceId = cookies.l_de;
        let CouponNo = post.CouponNo;
        let UserAgent = req.headers["user-agent"];
        let BrowserType = req.headers["user-agent"];

        let response = await api.server.registerCoupon.getFetch({
            AccountId: AccountId,
            DeviceId: DeviceId,
            CouponNo: CouponNo,
            UserAgent: UserAgent,
            BrowserType: BrowserType
        });

        if(response.error){
            body = JSON.stringify({
                error: response.error
            });
        }
        else{
            body = JSON.stringify({
                result: response.result
            });
        }

        res.writeHead("200", "OK", head);
        res.write(body)
        res.end();
    }
    catch(ex){
        console.log(ex.stack);

        body = JSON.stringify({
            error: {
                "code": -1,
                "message": "OtherError: ",
                "data": null
            }
        });

        res.writeHead(200, "OK", head);
        res.write(body)
        res.end();
    }
};

export default app;
