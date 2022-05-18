
import _ from "lodash";

const app = (episodes) => {
    let tabs = {
        tabList: new Array(),
        tabPane: new Array()
    };
    
    let cloneEpisodes = _.cloneDeep(episodes);
    let seasons = cloneEpisodes.seasons;

    for(let i = 0; i < seasons.length; i ++){
        let season = seasons[i];

        if(!season.episodes || !season.episodes.length){
            continue;
        }

        let secondaryMark = "";

        if(season.is_finale){
            secondaryMark = "全 " + season.episode_count + " 集";
        }
        else{
            secondaryMark = "更新至第 " + season.episode_count + " 集";
        }

        season.secondary_mark = secondaryMark;

        tabs.tabList.push(season);

        let _episodes = season.episodes;

        for(let j = 0; j < _episodes.length; j ++){
            let episdoe = _episodes[j];

            episdoe.title = season.title;
            episdoe.poster_banners = season.poster_banners;
        }

        tabs.tabPane.push(_episodes);
    }
    
    return tabs;
};

export default app;