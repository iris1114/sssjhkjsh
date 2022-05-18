
import svgCaptcha from "svg-captcha";

import aes128 from "../../assets/js/hash/aes128.js";

const app = async (req, res, next) => {
    if(req.method != "GET"){
        res.writeHead(400, "Bad Request");
        res.end();

        return;
    }
    
    try{
        const captcha = svgCaptcha.create({
            ignoreChars: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ69",
            noise: 5,
            color: false
        });

        let head = [
            ["Content-Type", "image/svg+xml"],
            ["Set-Cookie", [`l_cap=${aes128.encrypt(captcha.text)}; Path=/; Secure; HttpOnly; SameSite=Lax;`]]
        ];

        let env = process.env.NEXT_PUBLIC_ENV;

        if(env == "development"){
            head.push(
                ["Access-Control-Allow-Origin", "*"]
            );
        }

        res.writeHead("200", "OK", head);
        res.write(captcha.data)
        res.end();
    }
    catch(ex){
        console.log(ex.stack);
        res.writeHead(400, "Bad Request");
        res.end();
    }
};

export default app;
