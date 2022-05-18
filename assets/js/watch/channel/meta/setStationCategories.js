
const app = (lineup, stationCategories) => {
    let channels = lineup.channels;

    for(let i = 0; i < channels.length; i ++){
        let channel = channels[i];
        let categories = null;

        if(channel.content_type == "vod-channel" || channel.content_type == "playout-channel"){
            categories = channel.epg_categories;
        }
        else{
            categories = channel.Categories;
        }

        if(!categories){
            categories = new Array();
        }

        channel.station_categories = new Array();

        for(let j = 0; j < categories.length; j ++){
            let category = categories[j];
            let stationCategory = stationCategories[category];

            if(stationCategory){
                channel.station_categories.push(stationCategory);
            }
        }
    }

    return lineup
};

export default app;
