
import aes128 from "../../assets/js/hash/aes128.js";
import tools from "../../assets/js/tools/index.js";
import api from "../../assets/js/api/index.js";
import cookie from "../../assets/js/cookie/index.js";

import message from "../../assets/json/message/register.json";

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
        let cookies = tools.parseCookies(req);
        let capText = cookies["l_cap"];
        let captcha = post.Captcha;

        if(typeof post == "string"){
            post = JSON.parse(post);
        }

        capText = aes128.decrypt(capText);

        if(capText != captcha){
            cookie.register.clear(setCookies);

            body = JSON.stringify({
                error: message["register.error.badcaptcha"]
            });

            res.writeHead(200, "OK", head);
            res.write(body)
            res.end();

            return;
        }

        let regExp = /[0][9][0-9]{8}/;

        if(!regExp.test(post.MobileNumber)){
            cookie.register.clear(setCookies);

            body = JSON.stringify({
                error: message["register.error.badmobile"]
            });

            res.writeHead(200, "OK", head);
            res.write(body);
            res.end();

            return;
        }

        let status = await api.server.accountStatus.getFetch(post.MobileNumber);

        status = status.result;

        let DeviceId = cookies.l_de;

        post.DeviceId = DeviceId;

        if(!status.Exists){
            await api.server.register.getFetch(post);

            cookie.register.set(setCookies, post);

            body = JSON.stringify({
                error: ""
            });
        }
        else if(!status.Registered || !status.Activated){
            await api.server.requestPasscode.getFetch(post.MobileNumber, post.DeviceId);

            cookie.register.set(setCookies, post);

            body = JSON.stringify({
                error: ""
            });
        }
        else{
            cookie.register.clear(setCookies);

            body = JSON.stringify({
                error: message["register.error.mobileregistered"]
            });
        }

        res.writeHead(200, "OK", head);
        res.write(body)
        res.end();
    }
    catch(ex){
        console.log(ex.stack);

        cookie.register.clear(setCookies);

        body = JSON.stringify({
            error: message["register.error.other"]
        });

        res.writeHead(200, "OK", head);
        res.write(body)
        res.end();
    }
};

export default app;
