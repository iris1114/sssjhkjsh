
import aes128 from "../../assets/js/hash/aes128.js";
import tools from "../../assets/js/tools/index.js";
import api from "../../assets/js/api/index.js";

import message from "../../assets/json/message/requestPasscode.json";

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
        let cookies = tools.parseCookies(req);
        let MobileNumber = aes128.decrypt(cookies.l_r_mo);
        let DeviceId = cookies.l_de;
        
        await api.server.requestPasscode.getFetch(MobileNumber, DeviceId);

        body = JSON.stringify({
            error: ""
        });

        res.writeHead(200, "OK", head);
        res.write(body)
        res.end();
    }
    catch(ex){
        console.log(ex.stack);

        body = JSON.stringify({
            error: message["requestpasscode.error.other"]
        });

        res.writeHead(200, "OK", head);
        res.write(body)
        res.end();
    }
};

export default app;
