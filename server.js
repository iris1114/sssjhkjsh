
const Koa = require("koa");
const next = require("next");
const Router = require("@koa/router");
const https = require("https");
const fs = require("fs");

const host = process.env.HOST || "127.0.0.1";
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const config = require("./assets/json/config/config.common.json");

app.prepare().then(() => {
    const server = new Koa();
    const router = new Router();
    
    // koa router 9.0.0 or more
    router.all("(.*)", async (ctx) => {
        await handle(ctx.req, ctx.res);
        ctx.respond = false;
    });
    
    server.use(async (ctx, next) => {
        ctx.res.statusCode = 200;
        await next();
    });
    
    server.use(router.routes());
    
    const options = {
        key: fs.readFileSync("./server-key.pem"),
        cert: fs.readFileSync("./server-cert.pem"),
        ca: fs.readFileSync("./cert.pem")
    };
    
    server.listen(3000, host);
    
    https.createServer(options, server.callback()).listen(8888, host, () => {
        console.log("> Ready on http://localhost:3000");
        console.log("> Ready on https://localhost:8888");
        console.log("> NEXT_PUBLIC_ENV: " + process.env.NEXT_PUBLIC_ENV);
        console.log("> Version: " + config.version);
    });
});