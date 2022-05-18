
import seo from "../../index.js";

import contentTypeMap from "../../../../json/content/contentTypeMap.json";
import pkg from "../../../../../package.json";

const app = (searchProgram, request) => {
    let obj = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": []
    };

    if(searchProgram.content_type == "ent"){
        obj.itemListElement.push({
            "@type": "ListItem",
            "position": 1,
            "name": pkg.siteName,
            "item": "https://www.litv.tv"
        });

        obj.itemListElement.push({
            "@type": "ListItem",
            "position": 2,
            "name": contentTypeMap[searchProgram.content_type],
            "item": seo.vod.searchProgram.getUrl(searchProgram, request)
        });
    }
    else{
        obj.itemListElement.push({
            "@type": "ListItem",
            "position": 1,
            "name": pkg.siteName,
            "item": "https://www.litv.tv"
        });

        obj.itemListElement.push({
            "@type": "ListItem",
            "position": 2,
            "name": contentTypeMap[searchProgram.content_type],
            "item": seo.vod.home.getUrl(searchProgram.content_type)
        });

        obj.itemListElement.push({
            "@type": "ListItem",
            "position": 3,
            "name": searchProgram.result_type_name,
            "item": seo.vod.searchProgram.getUrl(searchProgram, request)
        });
    }

    return {
        __html: JSON.stringify(obj)
    };
};

export default app;
