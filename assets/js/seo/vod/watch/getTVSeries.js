
import seo from "../../index.js";

//Y!說為了他們的SEO要做的，此功能不再google文件中，效果如何不知道
const app = (entry, episodes) => {
    if(!entry){
        return null;
    }
    
    let programInfo = null;
    let isAccessibleForFree = false;

    if(entry.season){
        programInfo = entry.season;

        let seasonId = programInfo.season;

        for(let i = 0; i < episodes.seasons.length; i ++){
            let season = episodes.seasons[i];

            if(seasonId == season.season){
                let _episodes = season.episodes;

                for(let j = 0; j < _episodes.length; j ++){
                    if(_episodes[j].charge_mode == "F"){
                        isAccessibleForFree = true;

                        break;
                    }
                }

                break;
            }
        }
    }
    else{
        programInfo = entry.series;

        for(let i = 0; i < episodes.seasons.length; i ++){
            let season = episodes.seasons[i];
            let _episodes = season.episodes;

            for(let j = 0; j < _episodes.length; j ++){
                if(_episodes[j].charge_mode == "F"){
                    isAccessibleForFree = true;

                    break;
                }
            }

            if(isAccessibleForFree){
                break;
            }
        }
    }

    let obj = {
        "@context": "https://schema.org",
        "@type": "TVSeries",
        "@id": seo.vod.watch.getUrl(programInfo),
        "name": seo.vod.watch.getTitleWithSecondaryMark(programInfo),
        "description": seo.vod.watch.getDescription(programInfo),
        "url": seo.vod.watch.getUrl(programInfo),
        "copyrightYear": seo.vod.watch.getCopyrightYear(programInfo),
        "image": `${litv.config.cdnstatic}/${programInfo.picture}`,
        "isAccessibleForFree": isAccessibleForFree,
        "keywords": seo.vod.watch.getKeywords(programInfo),
        "genre": seo.vod.watch.getGenres(programInfo),
        "countryOfOrigin": seo.vod.watch.getCountryOfOrigin(programInfo),
        "dateCreated": seo.vod.watch.getUploadDate(programInfo)
    };
    
    seo.vod.watch.setActor(obj, programInfo);
    seo.vod.watch.setDirector(obj, programInfo);

    return {
        __html: JSON.stringify(obj)
    };
};

export default app;
