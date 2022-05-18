
import positives from "./positives.js";
import trailers from "./trailers.js";

const app = (programInfo, episodes) => {
    if(!episodes.seasons){
        return null;
    }

    let list = null;

    if(programInfo.video_type == "B" || programInfo.video_type == "T"){
        list = trailers(episodes);
    }
    else{
        list = positives(episodes);
    }

    let target = null;

    for(let i = 0; i < list.length; i ++){
        let item = list[i];

        if(programInfo.content_id == item.content_id){
            target = list[i + 1];

            break;
        }
    }

    if(target){
        return target;
    }
    
    return null;
};

export default app;