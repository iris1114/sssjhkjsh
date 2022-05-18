
import _ from "lodash";

const app = (episodes) => {
    let _episodes = _.cloneDeep(episodes);

    if(!_episodes || !_episodes.seasons){
        return null;
    }

    _episodes.seasons = _episodes.seasons.filter((season) => {
        let __episodes = season.episodes;

        if(!__episodes || !__episodes.length){
            return false;
        }
        else{
            __episodes = __episodes.filter((element) => {
                if(element.video_type == "T" || element.video_type == "B"){
                    return true;
                }

                return false;
            });

            if(!__episodes.length){
                return false;
            }
            else{
                season.episodes = __episodes;

                return true;
            }
        }
    });
    
    if(!_episodes.seasons.length){
        return null;
    }
    else{
        return _episodes;
    }
};

export default app;