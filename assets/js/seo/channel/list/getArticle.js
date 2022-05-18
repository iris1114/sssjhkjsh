
import seo from "../../index.js";

import pkg from "../../../../../package.json";

const app = (list) => {
    let obj = {
        "@context": "https://schema.org",
        "@type": "Article",
        "dateModified": seo.channel.list.getModifiedDate(),
        "datePublished": seo.common.getPublishedDate(),
        "name": seo.channel.list.getTitle(list),
        "headline": seo.channel.list.getTitle(list),
        "thumbnailUrl": seo.channel.list.getImage(list),
        "image": seo.channel.list.getImage(list),
        "author": {
            "@type": "Organization",
            "name": pkg.siteName
        },
        "publisher": {
            "@type": "Organization",
            "name": pkg.siteName,
            "logo": {
                "@type": "ImageObject",
                "url": "https://www.litv.tv/logo.png"
            }
        },
        "url": seo.channel.list.getUrl(),
        "mainEntityOfPage": seo.channel.list.getUrl(),
        "description": seo.channel.list.getDescription(list),
        "keywords": seo.channel.list.getKeywords(list)
    };

    return {
        __html: JSON.stringify(obj)
    };
};

export default app;
