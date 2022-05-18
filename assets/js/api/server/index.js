
import generateDeviceId from "./generateDeviceId.js";
import login from "./login.js";
import accountStatus from "./accountStatus.js";
import register from "./register.js";
import requestPasscode from "./requestPasscode.js";
import confirmMobileNumber from "./confirmMobileNumber.js";
import resetPassword from "./resetPassword.js";
import getAccountVar from "./getAccountVar.js";
import setAccountVar from "./setAccountVar.js";
import urls from "./urls.js";
import urlsNoAuth from "./urlsNoAuth.js";
import continueStreaming from "./continueStreaming.js";
import stopStreaming from "./stopStreaming.js";
import packageInfo from "./packageInfo.js";
import purchaseInfo from "./purchaseInfo.js";
import registerCoupon from "./registerCoupon.js";
import webPurchase from "./webPurchase.js";
import catalogInfo from "./catalogInfo.js";
import checkPromoCode from "./checkPromoCode.js";
import modifyPurchase from "./modifyPurchase.js";
import promoEligible from "./promoEligible.js";
import promoUse from "./promoUse.js";
import setPassword from "./setPassword.js";
import uid from "./uid.js";
import getNotices from "./getNotices.js";

const app = {
    generateDeviceId: generateDeviceId,
    login: login,
    accountStatus: accountStatus,
    register: register,
    requestPasscode: requestPasscode,
    confirmMobileNumber: confirmMobileNumber,
    resetPassword: resetPassword,
    getAccountVar: getAccountVar,
    setAccountVar: setAccountVar,
    urls: urls,
    urlsNoAuth: urlsNoAuth,
    continueStreaming: continueStreaming,
    stopStreaming: stopStreaming,
    packageInfo: packageInfo,
    purchaseInfo: purchaseInfo,
    registerCoupon: registerCoupon,
    webPurchase: webPurchase,
    catalogInfo: catalogInfo,
    checkPromoCode: checkPromoCode,
    modifyPurchase: modifyPurchase,
    promoEligible: promoEligible,
    promoUse: promoUse,
    setPassword: setPassword,
    uid: uid,
    getNotices: getNotices
};

export default app;
