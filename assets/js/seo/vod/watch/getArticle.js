
import seo from "../../index.js";

import pkg from "../../../../../package.json";

const app = (programInfo, seoDictionary) => {
    let obj = {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        "dateModified": seo.vod.watch.getModifiedDate(programInfo),
        "datePublished": seo.vod.watch.getUploadDate(programInfo),
        "name": seo.vod.watch.getTitle(programInfo, seoDictionary),
        "headline": seo.vod.watch.getTitle(programInfo, seoDictionary),
        "thumbnailUrl": seo.vod.watch.getThumbnailUrl(programInfo),
        "image": seo.vod.watch.getThumbnailUrl(programInfo),
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
        "url": seo.vod.watch.getUrl(programInfo),
        "mainEntityOfPage": seo.vod.watch.getUrl(programInfo),
        "description": seo.vod.watch.getDescription(programInfo),
        "keywords": seo.vod.watch.getKeywords(programInfo)
    };

    return {
        __html: JSON.stringify(obj)
    };
};

export default app;
