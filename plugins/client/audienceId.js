
import api from "../../assets/js/api/index.js";

const app = () => {
    try{
        api.spotx.audienceId.getFetch().then((res) => {
            if(res){
                litv.audienceId = res.audience_id;
            }
        });
    }
    catch(ex){
        console.log(ex.stack);
    }
};

export default app;
