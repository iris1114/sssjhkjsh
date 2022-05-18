
import api from "../../assets/js/api/index.js";
import tools from "../../assets/js/tools/index.js";
import cookie from "../../assets/js/cookie/index.js";
import aes128 from "../../assets/js/hash/aes128.js";

const auth = async (req, res, head, cookies, post, result) => {
    cookie.login.set(cookies, post, result);

    let body = JSON.stringify({
        result: true
    });

    res.writeHead("200", "OK", head);
    res.write(body);
    res.end();
};

const noAuth = async (req, res, head, cookies) => {
    cookie.login.clear(cookies);
    
    let body = JSON.stringify({
        result: false
    });

    res.writeHead("200", "OK", head);
    res.write(body);
    res.end();
};

const app = async (req, res, next) => {
    if(req.method != "POST"){
        res.writeHead(400, "Bad Request");
        res.end();

        return;
    }

    try{
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
        
        cookie.login.clear(setCookies);
        cookie.register.clear(setCookies);

        let cookies = tools.parseCookies(req);
        
        if(cookies.l_us && cookies.l_pa && cookies.l_de){
            let User = aes128.decrypt(cookies.l_us);
            let Pass = aes128.decrypt(cookies.l_pa);
            let DeviceId = cookies.l_de;
            let response = await api.server.login.getFetch(User, Pass, DeviceId);

            if(response.error){
                noAuth(req, res, head, setCookies);
            }
            else{
                auth(req, res, head, setCookies, {
                    User: User,
                    Pass: Pass,
                    DeviceId: DeviceId
                }, response.result);
            }
        }
        else{
            noAuth(req, res, head, setCookies);
        }
    }
    catch(ex){
        console.log(ex.stack);
        noAuth(req, res);
    }
};

export default app;
