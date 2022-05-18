
import seo from "../../index.js";

import pkg from "../../../../../package.json";

const app = (searchProgram, request) => {
    let obj = {
        "@context": "https://schema.org",
        "@type": "Article",
        "dateModified": seo.vod.searchProgram.getModifiedDate(),
        "datePublished": seo.common.getPublishedDate(),
        "name": seo.vod.searchProgram.getTitle(searchProgram),
        "headline": seo.vod.searchProgram.getTitle(searchProgram),
        "thumbnailUrl": seo.vod.searchProgram.getImage(searchProgram),
        "image": seo.vod.searchProgram.getImage(searchProgram),
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
        "url": seo.vod.searchProgram.getUrl(searchProgram, request),
        "mainEntityOfPage": seo.vod.searchProgram.getUrl(searchProgram, request),
        "description": seo.vod.searchProgram.getDescription(searchProgram, request)
    };
    
    return {
        __html: JSON.stringify(obj)
    };
};

export default app;
