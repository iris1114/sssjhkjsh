
import seo from "../../index.js";

import contentTypeMap from "../../../../json/content/contentTypeMap.json";
import pkg from "../../../../../package.json";

const app = (contentType, filterData) => {
    let obj = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": pkg.siteName,
                "item": "https://www.litv.tv"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": contentTypeMap[contentType],
                "item": seo.vod.home.getUrl(contentType)
            }
        ]
    };

    if(filterData[contentType]){
        obj.itemListElement.push({
            "@type": "ListItem",
            "position": 3,
            "name": "進階篩選",
            "item": seo.vod.filter.getUrl(contentType)
        });
    }
    else{
        obj.itemListElement.push({
            "@type": "ListItem",
            "position": 3,
            "name": "全部",
            "item": seo.vod.filter.getUrl(contentType)
        });
    }

    return {
        __html: JSON.stringify(obj)
    };
};

export default app;