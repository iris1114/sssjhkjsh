
import getQuery from "./getQuery.js";
import removeQuery from "./removeQuery.js";
import replaceQuery from "./replaceQuery.js";
import env from "./env.js";
import getReferringPartner from "./getReferringPartner.js";

const app = {
    getQuery: getQuery,
    removeQuery: removeQuery,
    replaceQuery: replaceQuery,
    env: env,
    getReferringPartner: getReferringPartner
};

export default app;
