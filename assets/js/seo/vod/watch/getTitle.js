
import seo from "../../index.js";

import pkg from "../../../../../package.json";

const app = (programInfo, seoDictionary) => {
    try{
        let title = seo.vod.watch.getTitleWithSecondaryMark(programInfo);
        let countryMap = seoDictionary[programInfo.content_type];
        
        if(countryMap){
            let countries = programInfo.countries;
            
            if(countries.length > 0){
                let country = countries[0];
                let id = country.id;
                let area = countryMap[id];
                
                if(!area){
                    area = countryMap.default;
                }

                title = `${title}-${area}線上看｜${pkg.siteName}`;
            }
            else{
                title = `${title}線上看｜${pkg.siteName}`;
            }
        }
        else{
            title = `${title}線上看｜${pkg.siteName}`;
        }
        
        return title;
    }
    catch(err){
        return "";
    }
};

export default app;
