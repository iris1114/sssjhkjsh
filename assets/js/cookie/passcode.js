
import aes128 from "../hash/aes128.js";

const set = (cookies, post) => {
    cookies.push(`l_r_pa=${aes128.encrypt(post.Passcode)}; Path=/; Secure; HttpOnly; SameSite=Lax;`);

    return cookies;
};

const clear = (cookies) => {
    cookies.push("l_r_pa=; Max-Age=0; Path=/; Secure; HttpOnly; SameSite=Lax;");
    
    return cookies;
};

const app = {
    set: set,
    clear: clear
};

export default app;
