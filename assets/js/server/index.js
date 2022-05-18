
import bsmServer from "./bsm.js";
import bsmApiServer from "./bsmApi.js";
import proxyServer from "./proxy.js";

const app = {
    bsmServer: bsmServer,
    bsmApiServer: bsmApiServer,
    proxyServer: proxyServer
};

export default app;
