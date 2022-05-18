
import _ from "lodash";

import plugins from "../../plugins/index.js";

import promoteMeta from "../../assets/json/header/promote.json";

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
            ["Access-Control-Allow-Origin", "*"]
        );
    }

    let body = "";

    try{
        let promote = _.cloneDeep(promoteMeta.items);
        let menu = await plugins.server.menu();

        if(promote){
            let config = litv.config;

            for(let i = 0; i < promote.length; i ++){
                promote[i].href = `${config.url}${promote[i].href}`;
                promote[i].src = require(`../../assets/image/header/promote/${promote[i].src}`);
            }
        }

        body = JSON.stringify({
            result: {
                menu: menu,
                promote: promote
            }
        });

        res.writeHead(200, "OK", head);
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
