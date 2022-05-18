
import tools from "../../assets/js/tools/index.js";
import api from "../../assets/js/api/index.js";

const app = async (ctx) => {
    try{
        let _ctx = ctx.ctx;
        let req = _ctx.req;
        let res = _ctx.res;
        let cookies = tools.parseCookies(req);
        let deviceId = cookies.l_de;
        let nCookies = res.getHeader("set-cookie");
        
        if(!nCookies){
            nCookies = new Array();
        }

        if(!deviceId){
            let response = await api.server.generateDeviceId.getFetch("");

            deviceId = response.result;
            
            nCookies.push(`l_de=${deviceId}; Max-Age=${litv.config.cookieMaxAge}; Path=/; Secure; HttpOnly; SameSite=Lax;`);
            res.setHeader("set-cookie", nCookies);
        }

        litv.deviceId = deviceId;

        return deviceId;
    }
    catch(ex){
        console.log(ex.stack);
    }
};

export default app;
