
const app = (episodes) => {
    let list = new Array();
    let seasons = episodes.seasons;

    for(let i = 0; i < seasons.length; i ++){
        let season = seasons[i];
        let _episodes = season.episodes;

        if(_episodes){
            for(let j = 0; j < _episodes.length; j ++){
                let episode = _episodes[j];

                if(episode.video_type == "B" || episode.video_type == "T"){
                    list.push(episode);
                }
            }
        }
    }

    return list;
};

export default app;