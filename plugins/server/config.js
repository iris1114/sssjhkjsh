
import _ from "lodash";

import common from "../../assets/json/config/config.common.json";
import dev from "../../assets/json/config/config.dev.json";
import stage from "../../assets/json/config/config.stage.json";
import prod from "../../assets/json/config/config.prod.json";

const app = () => {
    try{
        global.litv = global.litv || {};

        let env = process.env.NEXT_PUBLIC_ENV;
        let target = null;
        let config = null;

        if(env == "development"){
            target = dev;
        }
        else if(env == "staging"){
            target = stage;
        }
        else{
            target = prod;
        }
        
        config = _.extend(common, target);
        litv.config = config;

        return config;
    }
    catch(ex){
        console.log(ex.stack);
    }
};

export default app;
