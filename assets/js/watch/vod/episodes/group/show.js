
import _ from "lodash";

const app = (episodes) => {
    let tabs = {
        tabList: new Array(),
        tabPane: new Array()
    };

    let cloneEpisodes = _.cloneDeep(episodes);
    let count = 0;
    let arr = new Array();

    for(let i = 0; i < cloneEpisodes.seasons[0].episodes.length; i ++){
        let episode = cloneEpisodes.seasons[0].episodes[i];

        episode.title = cloneEpisodes.seasons[0].title;
        episode.poster_banners = cloneEpisodes.seasons[0].poster_banners

        arr.push(episode);

        if(count >= litv.config.showGroupNumber - 1 || i >= episodes.seasons[0].episodes.length - 1){
            let title = arr[0].episode_name + " - " + arr[arr.length - 1].episode_name;

            tabs.tabList.push(title);
            tabs.tabPane.push(arr);

            arr = new Array();
            count = 0;
        }
        else{
            count ++;
        }
    }
    
    return tabs;
};

export default app;