
import urls from "./urls";
import urlsNoAuth from "./urlsNoAuth.js";
import continueStreaming from "./continueStreaming.js";
import stopStreaming from "./stopStreaming.js";

const app = {
    urls: urls,
    urlsNoAuth: urlsNoAuth,
    continueStreaming: continueStreaming,
    stopStreaming: stopStreaming
};

export default app;