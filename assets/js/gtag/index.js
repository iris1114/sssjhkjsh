
import oneSignal from "./oneSignal/index.js";
import pwa from "./pwa/index.js";
import crossSite from "./crossSite.js";
import pageview from "./pageview.js";
import pageviewMkt from "./pageviewMkt.js";

const app = {
    oneSignal: oneSignal,
    pwa: pwa,
    crossSite: crossSite,
    pageview: pageview,
    pageviewMkt: pageviewMkt
};

export default app;
