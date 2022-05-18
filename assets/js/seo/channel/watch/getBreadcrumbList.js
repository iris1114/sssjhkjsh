
import seo from "../../index.js";

import pkg from "../../../../../package.json";

const app = (programInfo) => {
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
                "name": "頻道推薦",
                "item": seo.channel.home.getUrl()
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": programInfo.title,
                "item": seo.channel.watch.getUrl(programInfo)
            }
        ]
    };

    return {
        __html: JSON.stringify(obj)
    };
};

export default app;
