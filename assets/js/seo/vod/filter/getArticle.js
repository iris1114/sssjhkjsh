
import seo from "../../index.js";

import pkg from "../../../../../package.json";

const app = (contentType, filter, searchProgram) => {
    let obj = {
        "@context": "https://schema.org",
        "@type": "Article",
        "dateModified": seo.vod.filter.getModifiedDate(),
        "datePublished": seo.common.getPublishedDate(),
        "name": seo.vod.filter.getTitle(contentType, filter),
        "headline": seo.vod.filter.getTitle(contentType, filter),
        "thumbnailUrl": seo.vod.filter.getImage(searchProgram),
        "image": seo.vod.filter.getImage(searchProgram),
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
        "url": seo.vod.filter.getUrl(contentType),
        "mainEntityOfPage": seo.vod.filter.getUrl(contentType),
        "description": seo.vod.filter.getDescription(contentType)
    };

    return {
        __html: JSON.stringify(obj)
    };
};

export default app;
