

import tools from "../../assets/js/tools/index.js";
import aes128 from "../../assets/js/hash/aes128.js";
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
        let AccountId = aes128.decrypt(cookies["l_ac"]);
        let Token = aes128.decrypt(cookies["l_to"]);
        let DeviceId = cookies["l_de"];
        let PromoCode = post.PromoCode;

        let response = await api.server.promoUse.getFetch({
            AccountId: AccountId,
            Token: Token,
            DeviceId: DeviceId,
            PromoCode: PromoCode
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
/*
import promoUse from "../api/promoUse.js";
import cookieParse from "../cookie/parse.js";
import aes128 from "../hash/aes128.js";

export default async (req, res, next) => {
    if(req.method != "POST"){
        res.writeHead(400, "Bad Request");
        res.end();

        return;
    }
    
    let post = "";

    let head = [
        ["Content-Type", "application/json"]
    ];

    let body = "";
 
    req.on("data", async (chunk) => {    
        post += chunk;
    });

    req.on("end", async () => {
        post = JSON.parse(post);

        try{
            let cookies = cookieParse(req);
            let AccountId = aes128.decrypt(cookies["l_ac"]);
            let Token = aes128.decrypt(cookies["l_to"]);
            let DeviceId = cookies["l_de"];
            let PromoCode = post.PromoCode;
    
            let response = await promoUse.getAxios({
                AccountId: AccountId,
                Token: Token,
                DeviceId: DeviceId,
                PromoCode: PromoCode
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
    });
};
*/