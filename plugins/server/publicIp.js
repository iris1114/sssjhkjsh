
import requestIp from "request-ip";

const app = (ctx) => {
    try{
        return requestIp.getClientIp(ctx.ctx.req);
    }
    catch(ex){
        console.log(ex.stack);
    }
};

export default app;