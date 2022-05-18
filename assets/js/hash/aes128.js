
//因為涉及加密種子的問題，client side絕對不能import，只能用在server side。
import crypto from "crypto";
import urlencode from "urlencode";

//避免frontend去使用
if(typeof window != "undefined"){ 
    location.href = "https://support.litv.tv";
}

let key = "2774008327690188"; 
let iv = "2769018827740083";  

key = Buffer.from(key, "utf8");
iv = Buffer.from(iv, "utf8");

const addRndNumber = (str) => {
    let first = Math.floor(Math.random() * 10);
    let last = Math.floor(Math.random() * 10);

    str = String(first) + str + String(last);

    return str;
};

const encrypt = (str) => {
    str = String(str);
    str = addRndNumber(str);

    let cipher = crypto.createCipheriv("aes-128-cbc", key, iv);
    let enc = cipher.update(str, "utf8", "base64");

    enc += cipher.final("base64");
    enc = urlencode.encode(enc);
    
    return enc;
};

const decrypt = (str) => {
    str = String(str);
    str = urlencode.decode(str);
    
    let decipher = crypto.createDecipheriv("aes-128-cbc", key, iv);
    let dec = decipher.update(str, "base64", "utf8");

    dec += decipher.final("utf8");
    dec = dec.substring(1, dec.length - 1);
    
    return dec;
};

const app = {
    encrypt: encrypt, 
    decrypt: decrypt
};

export default app;
