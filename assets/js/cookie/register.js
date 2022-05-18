
import aes128 from "../hash/aes128.js";

const set = (cookies, post) => {
    cookies.push(`l_r_mo=${aes128.encrypt(post.MobileNumber)}; Path=/; Secure; HttpOnly; SameSite=Lax;`);
    cookies.push(`l_r_bi=${aes128.encrypt(post.CustomerInformation.BirthYear)}; Path=/; Secure; HttpOnly; SameSite=Lax;`);
    cookies.push(`l_r_se=${aes128.encrypt(post.CustomerInformation.Sex)}; Path=/; Secure; HttpOnly; SameSite=Lax;`);

    if(post.ReferringPartner){
        cookies.push(`l_r_re=${aes128.encrypt(post.ReferringPartner)}; Path=/; Secure; HttpOnly; SameSite=Lax;`);
    }
    
    return cookies;
};

const clear = (cookies) => {
    cookies.push("l_r_mo=; Max-Age=0; Path=/; Secure; HttpOnly; SameSite=Lax;");
    cookies.push("l_r_bi=; Max-Age=0; Path=/; Secure; HttpOnly; SameSite=Lax;");
    cookies.push("l_r_se=; Max-Age=0; Path=/; Secure; HttpOnly; SameSite=Lax;");
    cookies.push("l_r_re=; Max-Age=0; Path=/; Secure; HttpOnly; SameSite=Lax;");
    
    return cookies;
};

const app = {
    set: set,
    clear: clear
};

export default app;
