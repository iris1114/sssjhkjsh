
import { combineReducers } from "redux";

import loginReducer from "./loginReducer.js";
import routerReducer from "./routerReducer.js";
import accountInfoReducer from "./accountInfoReducer.js";
import resizeReducer from "./resizeReducer.js";
import visibilityStateReducer from "./visibilityStateReducer.js";
import beforeUnloadReducer from "./beforeUnloadReducer.js";
import scrollReducer from "./scrollReducer.js";
import readyReducer from "./readyReducer.js";
import dialogReducer from "./dialogReducer.js";
import fullscreenReducer from "./fullscreenReducer.js";
import notificationReducer from "./notification/rootReducer.js";
import headerReducer from "./header/rootReducer.js";
import footerReducer from "./footer/rootReducer.js";
import loadingReducer from "./loadingReducer.js";
import vodReducer from "./vod/rootReducer.js";
import toastReducer from "./toastReducer.js";
import ratingPassReducer from "./ratingPassReducer.js";
import purchasePassReducer from "./purchasePassReducer.js";
import tvodPassReducer from "./tvodPassReducer.js";
import playerReducer from "./player/rootReducer.js";
import companionAdReducer from "./companionAd/rootReducer.js";
import purchaseReducer from "./purchase/rootReducer.js";
import channelReducer from "./channel/rootReducer.js";
import menuReducer from "./menuReducer.js";
import fbReadyReducer from "./fbReadyReducer.js";
import diversionReducer from "./diversion/rootReducer.js";

const app = combineReducers({
    login: loginReducer,
    router: routerReducer,
    accountInfo: accountInfoReducer,
    resize: resizeReducer,
    visibilityState: visibilityStateReducer,
    beforeUnload: beforeUnloadReducer,
    scroll: scrollReducer,
    ready: readyReducer,
    dialog: dialogReducer,
    fullscreen: fullscreenReducer,
    notification: notificationReducer,
    header: headerReducer,
    footer: footerReducer,
    loading: loadingReducer,
    vod: vodReducer,
    toast: toastReducer,
    ratingPass: ratingPassReducer,
    purchasePass: purchasePassReducer,
    tvodPass: tvodPassReducer,
    player: playerReducer,
    companionAd: companionAdReducer,
    purchase: purchaseReducer,
    channel: channelReducer,
    menu: menuReducer,
    fbReady: fbReadyReducer,
    diversion: diversionReducer
});

export default app;
