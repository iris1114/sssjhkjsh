
import config from "./config.js";
import generateDeviceId from "./generateDeviceId.js";
import redirectByUserAgent from "./redirectByUserAgent.js";
import userAgent from "./userAgent.js";
import publicIp from "./publicIp.js";
import menu from "./menu.js";
import robots from "./robots.js";

const app = {
    config: config,
    generateDeviceId: generateDeviceId,
    redirectByUserAgent: redirectByUserAgent,
    userAgent: userAgent,
    publicIp: publicIp,
    menu: menu,
    robots: robots
};

export default app;
