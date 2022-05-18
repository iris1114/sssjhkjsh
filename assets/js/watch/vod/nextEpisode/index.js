
import normal from "./normal.js";
import rule from "./rule.js";

const app = (programInfo, episodes) => {
    if(!episodes){
        return null;
    }

    if(programInfo.is_series && episodes.has_seasons){
        return normal(programInfo, episodes);
    }
    else if(programInfo.is_series && !episodes.has_seasons){
        return normal(programInfo, episodes);
    }
    else if(programInfo.rule_id){
        return rule(programInfo, episodes);
    }

    return null;
};

export default app;
