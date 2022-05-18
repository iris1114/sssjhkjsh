
import parseCookies from "./parseCookies.js";
import importScript from "./importScript.js";
import importImage from "./importImage.js";
import encryptAccountInfo from "./encryptAccountInfo.js";
import isElement from "./isElement.js";
import birthYearOptions from "./birthYearOptions.js";
import creditMonthOptions from "./creditMonthOptions.js";
import creditYearOptions from "./creditYearOptions.js";
import formattedTime from "./formattedTime.js";
import getSessionUid from "./getSessionUid.js";
import storage from "./storage.js";
import url from "./url/index.js";
import hook from "./hook/index.js";
import getCursorPosition from "./getCursorPosition.js";
import date from "./date/index.js";

const app = {
    parseCookies: parseCookies,
    importScript: importScript,
    importImage: importImage,
    encryptAccountInfo: encryptAccountInfo,
    isElement: isElement,
    birthYearOptions: birthYearOptions,
    creditMonthOptions: creditMonthOptions,
    creditYearOptions: creditYearOptions,
    formattedTime: formattedTime,
    getSessionUid: getSessionUid,
    storage: storage,
    url: url,
    hook: hook,
    getCursorPosition: getCursorPosition,
    date: date
};

export default app;
