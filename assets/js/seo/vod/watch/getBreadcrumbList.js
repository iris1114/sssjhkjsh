
import watch from "../../../watch/index.js";
import seo from "../../index.js";

import contentTypeMap from "../../../../json/content/contentTypeMap.json";
import pkg from "../../../../../package.json";

const app = (programInfo, entry) => {
    let count = 1;

    let obj = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": count ++,
                "name": pkg.siteName,
                "item": "https://www.litv.tv"
            }
        ]
    };

    if(programInfo.rule_id){
        obj.itemListElement.push({
            "@type": "ListItem",
            "position": count ++,
            "name": contentTypeMap[programInfo.content_type],
            "item": seo.vod.searchProgram.getUrl({
                content_type: programInfo.content_type
            }, {
                categoryId: "113"
            })
        });
    }
    else{
        obj.itemListElement.push({
            "@type": "ListItem",
            "position": count ++,
            "name": contentTypeMap[programInfo.content_type],
            "item": seo.vod.home.getUrl(programInfo.content_type)
        });

        if(entry){
            if(entry.series){
                obj.itemListElement.push({
                    "@type": "ListItem",
                    "position": count ++,
                    "name": entry.series.title,
                    "item": seo.vod.watch.getUrl(entry.series)
                });
            }

            if(entry.season){
                obj.itemListElement.push({
                    "@type": "ListItem",
                    "position": count ++,
                    "name": entry.season.season_name,
                    "item": seo.vod.watch.getUrl(entry.season)
                });
            }
        }
    }

    if(!programInfo.is_series){
        obj.itemListElement.push({
            "@type": "ListItem",
            "position": count ++,
            "name": programInfo.title,
            "item": seo.vod.watch.getUrl(programInfo)
        });
    }
    else{
        if(!watch.vod.entryPoint(programInfo)){
            let name = programInfo.secondary_mark;

            if(!name){
                name = programInfo.title;
            }

            obj.itemListElement.push({
                "@type": "ListItem",
                "position": count ++,
                "name": name,
                "item": seo.vod.watch.getUrl(programInfo)
            });
        }
    }

    return {
        __html: JSON.stringify(obj)
    };
};

export default app;
