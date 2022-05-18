
const app = (url, key, value) => {
    let results = new RegExp(`[\\?&](${key}=[^&#]*)`).exec(url);
    
    if(results){
        url = url.replace(results[1], `${key}=${value}`);
    }
    else{
        if(url.indexOf("?") != -1 && url.indexOf("&") != -1){
            url += (`&${key}=${value}`);
        }
        else if(url.indexOf("?") != -1){
            if(url.indexOf("?") >= url.length - 1){
                url += (`${key}=${value}`);
            }
            else{
                url += (`&${key}=${value}`);
            }
        }
        else{
            url += (`?${key}=${value}`);
        }
    }
    
    return url;
};

export default app;
