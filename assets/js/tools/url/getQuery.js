
const app = (url, key) => {
    let results = new RegExp(`[\\?&]${key}=([^&#]*)`).exec(url);

    if (results){
        if(results[1]){
            return results[1];
        }
    }

    return null;
};

export default app;
