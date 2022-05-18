
import seo from "../../index.js";

import pkg from "../../../../../package.json";

const app = (programInfo, introduction, seoDictionary) => {
    let obj = {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        "@id": seo.channel.watch.getUrl(programInfo),
        "url": seo.channel.watch.getUrl(programInfo),
        "duration": "PT240M",
        "datePublished": seo.channel.watch.getUploadDate(),
        "uploadDate": seo.channel.watch.getUploadDate(),
        "thumbnailUrl": seo.channel.watch.getThumbnailUrl(programInfo, introduction),
        "image": seo.channel.watch.getThumbnailUrl(programInfo, introduction),
        "name": seo.channel.watch.getTitle(programInfo, seoDictionary),
        "description": seo.channel.watch.getDescription(programInfo, introduction),
        "contentUrl": seo.channel.watch.getThumbnailUrl(programInfo, introduction)[0],
        "isAccessibleForFree": seo.channel.watch.isAccessibleForFree(programInfo), //Y!要的
        "keywords": seo.channel.watch.getKeywords(programInfo, introduction),
        "author": {
            "@type": "Organization",
            "name": pkg.siteName
        },
        "publication": {
            "@type": "BroadcastEvent",
            "isLiveBroadcast": true,
            "startDate": seo.channel.watch.getUploadDate()
        }
    };

    return {
        __html: JSON.stringify(obj)
    };
};

export default app;
