
import watch from "../../../watch/index.js";

const app = (programInfo) => {
    let title = programInfo.title;
        
    if(programInfo.secondary_mark){
        if(programInfo.is_series){
            if(watch.vod.entryPoint(programInfo)){
                title = `${title}-${programInfo.secondary_mark}`;
            }
            else{
                title = `${title}${programInfo.secondary_mark}`;
            }
        }
        else{
            title = `${title}-${programInfo.secondary_mark}`;
        }
    }

    return title;
};

export default app;
