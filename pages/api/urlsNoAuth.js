
import api from "../../assets/js/api/index.js";
import requestIp from "request-ip";
import tools from "../../assets/js/tools/index.js";

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
        let AssetId = post.AssetId;
        let MediaType = post.MediaType;
        let RemoteIp = requestIp.getClientIp(req);
        let DeviceId = cookies.l_de;
        
        let response = await api.server.urlsNoAuth.getFetch(AssetId, MediaType, RemoteIp, DeviceId);
        
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

        res.writeHead("200", "OK", head);
        res.write(body)
        res.end();
    }
};

export default app;
