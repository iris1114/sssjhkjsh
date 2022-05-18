
import seo from "../../index.js";

import titleMap from "../../../../json/content/titleMap.json";
import pkg from "../../../../../package.json";

const app = (contentType) => {
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
                "name": titleMap[contentType],
                "item": seo.vod.home.getUrl(contentType)
            }
        ]
    };

    return {
        __html: JSON.stringify(obj)
    };
};

export default app;
