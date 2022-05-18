
import aes128 from "../hash/aes128.js";

const set = (cookies, post) => {
    cookies.push("Set-Cookie", `l_r_mo=${aes128.encrypt(post.MobileNumber)}; Path=/; Secure; HttpOnly; SameSite=Lax;`);
    
    return cookies;
};

const clear = (cookies) => {
    cookies.push("Set-Cookie", "l_r_mo=; Max-Age=0; Path=/; Secure; HttpOnly; SameSite=Lax;");
    
    return cookies;
};

const app = {
    set: set,
    clear: clear
};

export default app;
