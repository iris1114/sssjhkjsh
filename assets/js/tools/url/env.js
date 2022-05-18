
import url from "url";

const app = () => {
    let href = location.href;
    let detail = url.parse(href);
    
    if(detail.hostname == "s.litv.tv"){
        return "staging";
    }
    else if(detail.hostname == "www.litv.tv"){
        return "production";
    }
    
    return "developmenet";
};

export default app;
