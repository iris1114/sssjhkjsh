
import cookie from "../../assets/js/cookie/index.js";

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

        let body = "";

        res.writeHead("200", "OK", head);
        res.write(body)
        res.end();
    }
    catch(ex){
        console.log(ex.stack);
        res.writeHead(400, "Bad Request");
        res.end();
    }
};

export default app;
