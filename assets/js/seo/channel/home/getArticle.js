
import seo from "../../index.js";

import pkg from "../../../../../package.json";

const app = (introduction, banner) => {
    let obj = {
        "@context": "https://schema.org",
        "@type": "Article",
        "dateModified": seo.channel.home.getModifiedDate(),
        "datePublished": seo.common.getPublishedDate(),
        "name": seo.channel.home.getTitle(introduction),
        "headline": seo.channel.home.getTitle(introduction),
        "thumbnailUrl": seo.channel.home.getImage(banner),
        "image": seo.channel.home.getImage(banner),
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
        "url": seo.channel.home.getUrl(),
        "mainEntityOfPage": seo.channel.home.getUrl(),
        "description": seo.channel.home.getDescription(introduction),
        "keywords": seo.channel.home.getKeywords(introduction)
    };

    return {
        __html: JSON.stringify(obj)
    };
};

export default app;
