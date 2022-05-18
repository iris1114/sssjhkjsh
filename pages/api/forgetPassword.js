
import api from "../../assets/js/api/index.js";
import cookie from "../../assets/js/cookie/index.js";
import tools from "../../assets/js/tools/index.js";
import aes128 from "../../assets/js/hash/aes128.js";

import message from "../../assets/json/message/forgetPassword.json";

const app = async (req, res, next) => {
    if(req.method != "POST"){
        res.writeHead(400, "Bad Request");
        res.end();

        return;
    }

    let setCookies = new Array();

    let head = [
        ["Content-Type", "application/json"],
        ["Set-Cookie", setCookies]
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
        let regExp = /[0][9][0-9]{8}/;

        if(typeof post == "string"){
            post = JSON.parse(post);
        }

        if(!regExp.test(post.MobileNumber)){
            cookie.forgetPassword.clear(setCookies);

            body = JSON.stringify({
                error: message["forgetpassword.error.badmobile"]
            });

            res.writeHead(200, "OK", head);
            res.write(body)
            res.end();

            return;
        }

        let cookies = tools.parseCookies(req);
        let capText = cookies["l_cap"];
        let captcha = post.Captcha;

        capText = aes128.decrypt(capText);

        if(capText != captcha){
            cookie.forgetPassword.clear(setCookies);

            body = JSON.stringify({
                error: message["forgetpassword.error.badcaptcha"]
            });

            res.writeHead(200, "OK", head);
            res.write(body)
            res.end();

            return;
        }

        let status = await api.server.accountStatus.getFetch(post.MobileNumber);

        status = status.result;

        if(!status.Exists){
            cookie.forgetPassword.clear(setCookies);

            body = JSON.stringify({
                error: message["forgetpassword.error.mobileunregistered"]
            });

            res.writeHead(200, "OK", head);
            res.write(body)
            res.end();

            return;
        }

        let DeviceId = cookies.l_de;
            
        post.DeviceId = DeviceId;

        if(status.Activated){
            await api.server.requestPasscode.getFetch(post.MobileNumber, post.DeviceId);

            cookie.forgetPassword.set(setCookies, post);

            body = JSON.stringify({
                error: ""
            });
        }
        else{
            cookie.forgetPassword.clear(setCookies);

            body = JSON.stringify({
                error: message["forgetpassword.error.mobileunactived"]
            });
        }

        res.writeHead(200, "OK", head);
        res.write(body)
        res.end();
    }
    catch(ex){
        console.log(ex.stack);

        cookie.forgetPassword.clear(setCookies);

        body = JSON.stringify({
            error: message["forgetpassword.error.other"]
        });

        res.writeHead(200, "OK", head);
        res.write(body)
        res.end();
    }
};

export default app;
