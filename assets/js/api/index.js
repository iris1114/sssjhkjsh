
import server from "./server/index.js";
import account from "./account/index.js";
import env from "./env/index.js";
import fino from "./fino/index.js";
import ccc from "./ccc/index.js";
import pusti from "./pusti/index.js";
import acs from "./acs/index.js";
import clientVarService from "./clientVarService/index.js";
import loadService from "./loadService/index.js";
import bsm from "./bsm/index.js";
import trackLog from "./trackLog/index.js";
import taiwanmedia from "./taiwanmedia/index.js";
import accinfo from "./accinfo/index.js";
import spotx from "./spotx/index.js";

const app = {
    server: server,
    account: account,
    env: env,
    fino: fino,
    ccc: ccc,
    pusti: pusti,
    acs: acs,
    clientVarService: clientVarService,
    loadService: loadService,
    bsm: bsm,
    trackLog: trackLog,
    taiwanmedia: taiwanmedia,
    accinfo: accinfo,
    spotx: spotx
};

export default app;
