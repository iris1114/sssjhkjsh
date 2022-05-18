
import api from "../../assets/js/api/index.js";
import tools from "../../assets/js/tools/index.js";
import cookie from "../../assets/js/cookie/index.js";

const app = async (req, res, next) => {
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
        if(req.method != "POST"){
            res.writeHead(400, "Bad Request");
            res.end();
    
            return;
        }

        let cookies = tools.parseCookies(req);
        let post = req.body;

        if(typeof post == "string"){
            post = JSON.parse(post);
        }

        post.DeviceId = cookies.l_de;
    
        let response = await api.server.login.getFetch(post.User, post.Pass, post.DeviceId);
        
        if(response.error){
            cookie.login.clear(setCookies);
            
            body = JSON.stringify({
                result: false
            });
        }
        else{
            cookie.login.set(setCookies, post, response.result);
            
            body = JSON.stringify({
                result: true
            });
        }
        
        res.writeHead(200, "OK", head);
        res.write(body)
        res.end();
    }
    catch(ex){
        console.log(ex.stack);
            
        cookie.login.clear(setCookies);

        body = JSON.stringify({
            result: false
        });
        
        res.writeHead(200, "OK", head);
        res.write(body)
        res.end();
    }
};

export default app;
