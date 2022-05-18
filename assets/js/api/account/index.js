
import auth from "./auth.js";
import info from "./info.js";
import login from "./login.js";
import logout from "./logout.js";
import register from "./register.js";
import requestPasscode from "./requestPasscode.js";
import passcode from "./passcode.js";
import resetPasswordByPasscode from "./resetPasswordByPasscode.js";
import forgetPassword from "./forgetPassword.js";
import promoEligible from "./promoEligible.js";
import promoUse from "./promoUse.js";
import setPassword from "./setPassword.js";

const app = {
    auth: auth,
    info: info,
    login: login,
    logout: logout,
    register: register,
    requestPasscode: requestPasscode,
    passcode: passcode,
    resetPasswordByPasscode: resetPasswordByPasscode,
    forgetPassword: forgetPassword,
    promoEligible: promoEligible,
    promoUse: promoUse,
    setPassword: setPassword
};

export default app;
