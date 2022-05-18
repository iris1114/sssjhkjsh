
import aes128 from "../hash/aes128.js";

const set = (cookies, post, result) => {
    let config = litv.config;

    cookies.push(`l_us=${aes128.encrypt(post.User)}; Max-Age=${config.cookieMaxAge}; Path=/; Secure; HttpOnly; SameSite=Lax;`);
    cookies.push(`l_pa=${aes128.encrypt(post.Pass)}; Max-Age=${config.cookieMaxAge}; Path=/; Secure; HttpOnly; SameSite=Lax;`);
    cookies.push(`l_ac=${aes128.encrypt(result.AccountId)}; Max-Age=${config.cookieMaxAg}; Path=/; Secure; HttpOnly; SameSite=Lax;`);
    cookies.push(`l_to=${aes128.encrypt(result.Token)}; Max-Age=${config.cookieMaxAge}; Path=/; Secure; HttpOnly; SameSite=Lax;`);
    
    return cookies;
};

const clear = (cookies) => {
    cookies.push("l_us=; Max-Age=0; Path=/; Secure; HttpOnly; SameSite=Lax;");
    cookies.push("l_pa=; Max-Age=0; Path=/; Secure; HttpOnly; SameSite=Lax;");
    cookies.push("l_ac=; Max-Age=0; Path=/; Secure; HttpOnly; SameSite=Lax;");
    cookies.push("l_to=; Max-Age=0; Path=/; Secure; HttpOnly; SameSite=Lax;");
    
    return cookies;
};

const app = {
    set: set,
    clear: clear
};

export default app;
