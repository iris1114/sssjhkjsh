
import watch from "../index.js";

const app = (programInfo, episodes) => {
    if(!episodes){
        return null;
    }

    if(!programInfo.is_series){
        return null;
    }

    let obj = {
        series: null,
        season: null
    };

    if(watch.vod.entryPoint(programInfo)){
        if(episodes.has_seasons && programInfo.season != "0"){
            obj.series = episodes.content_id,
            obj.season = programInfo.content_id
        }
        else{
            obj.series = episodes.content_id
        }
    }
    else{
        if(episodes.has_seasons){
            let seasonId = programInfo.season;

            for(let i = 0; i < episodes.seasons.length; i ++){
                let season = episodes.seasons[i];

                if(seasonId == season.season){
                    obj.series = episodes.content_id,
                    obj.season = season.content_id
                }
            }
        }
        else{
            obj.series = episodes.content_id;
        }
    }

    return obj;
};

export default app;
