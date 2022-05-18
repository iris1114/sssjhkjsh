
import vod from "./vod/index.js";
import channel from "./channel/index.js";
import Vmx from "./vmx/index.js";
import getAdUrlReplacement from "./getAdUrlReplacement.js";

const app = {
    vod: vod,
    channel: channel,
    Vmx: Vmx,
    getAdUrlReplacement: getAdUrlReplacement
};

export default app;
