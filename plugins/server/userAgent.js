
import { useUserAgent } from "next-useragent";

const app = (ctx) => {
    try{
        return useUserAgent(ctx.ctx.req.headers["user-agent"]);
    }
    catch(ex){
        console.log(ex.stack);
    }
};

export default app;