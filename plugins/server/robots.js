
const app = (ctx) => {
    try{
        let host = ctx.ctx.req.headers.host;
        
        if(host != "www.litv.tv"){
            ctx.ctx.res.setHeader("X-Robots-Tag", "none");
        }
    }
    catch(ex){
        console.log(ex.stack);
    }
};

export default app;