
import _ from "lodash";

const app = (episodes) => {
    let _episodes = _.cloneDeep(episodes);

    if(!_episodes.program_list){
        return null;
    }
    else if(!_episodes.program_list.length){
        return null;
    }
    else{
        return _episodes.program_list;
    }
};

export default app;