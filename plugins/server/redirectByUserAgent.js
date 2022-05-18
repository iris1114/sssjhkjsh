
import { useUserAgent } from "next-useragent";

const app = (ctx) => {
    try{
        let ua = useUserAgent(ctx.ctx.req.headers["user-agent"]);

        if(ua.isMobile || ua.isTablet){
            ctx.ctx.res.writeHead(302, {
                Location: `https://m.litv.tv${ctx.ctx.req.url}`
            });
        
            ctx.ctx.res.end();
        }
    }
    catch(ex){
        console.log(ex.stack);
    }
};

export default app;
