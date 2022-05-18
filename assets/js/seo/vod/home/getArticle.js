
import seo from "../../index.js";

import pkg from "../../../../../package.json";

const app = (contentType, banner) => {
    let obj = {
        "@context": "https://schema.org",
        "@type": "Article",
        "dateModified": seo.vod.home.getModifiedDate(),
        "datePublished": seo.common.getPublishedDate(),
        "name": seo.vod.home.getTitle(contentType),
        "headline": seo.vod.home.getTitle(contentType),
        "thumbnailUrl": seo.vod.home.getImage(banner),
        "image": seo.vod.home.getImage(banner),
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
        "url": seo.vod.home.getUrl(contentType),
        "mainEntityOfPage": seo.vod.home.getUrl(contentType),
        "description": seo.vod.home.getDescription(contentType)
    };

    return {
        __html: JSON.stringify(obj)
    };
};

export default app;
