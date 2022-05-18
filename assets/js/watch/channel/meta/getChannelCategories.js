
import _ from "lodash";

const app = (lineup, stationCategories) => {
    stationCategories = _.cloneDeep(stationCategories);

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

        for(let j = 0; j < categories.length; j ++){
            let category = categories[j];
            let stationCategory = stationCategories[category];

            if(stationCategory){
                if(!stationCategory.channels){
                    stationCategory.channels = new Array();
                }

                stationCategory.channels.push(channel);
            }
        }
    }

    let list = new Array();

    for(let key in stationCategories){
        let stationCategory = stationCategories[key];

        if(stationCategory.channels && stationCategory.channels.length){
            list.push(stationCategory);
        }
    }

    list = list.sort((a, b) => {
        a = parseInt(a.MenuOrder);
        b = parseInt(b.MenuOrder);
        
        return a - b;
    });
    
    return list;
}; 

export default app;
