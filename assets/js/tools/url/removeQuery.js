
const app = (url, key) => {
    let results = new RegExp(`([\\?](${key}=[^&#]*[&]?)|([&]${key}=[^&#]*))`).exec(url);
    let result = null;
    
    if(results){
        if(results[2]){
            result = results[2];
        }
        else if(results[3]){
            result = results[3];
        }
    }
    
    if(result){
        url = url.replace(result, "");
    }

    return url;
};

export default app;
