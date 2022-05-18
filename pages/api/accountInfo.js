
import aes128 from "../../assets/js/hash/aes128.js";
import tools from "../../assets/js/tools/index.js";

const app = async (req, res, next) => {
    if(req.method != "POST"){
        res.writeHead(400, "Bad Request");
        res.end();

        return;
    }

    let body = "";

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

    try{
        let cookies = tools.parseCookies(req);
        
        if(cookies.l_us){
            let User = aes128.decrypt(cookies.l_us);
            
            User = tools.encryptAccountInfo(User);

            body = JSON.stringify({
                result: {
                    User: User
                }
            });
        }
        else{
            body = JSON.stringify({
                result: null
            });
        }
    
        res.writeHead("200", "OK", head);
        res.write(body)
        res.end();
    }
    catch(ex){
        console.log(ex.stack);

        body = JSON.stringify({
            result: null
        });

        res.writeHead("200", "OK", head);
        res.write(body)
        res.end();
    }
};

export default app;
