
import seo from "../../index.js";

import pkg from "../../../../../package.json";

const app = (programInfo, seoDictionary) => {
    let obj = {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        "@id": seo.vod.watch.getUrl(programInfo),
        "url": seo.vod.watch.getUrl(programInfo),
        "duration": seo.vod.watch.getDuration(programInfo),
        "datePublished": seo.vod.watch.getUploadDate(programInfo),
        "uploadDate": seo.vod.watch.getUploadDate(programInfo),
        "thumbnailUrl": seo.vod.watch.getThumbnailUrl(programInfo),
        "image": seo.vod.watch.getThumbnailUrl(programInfo),
        "name": seo.vod.watch.getTitle(programInfo, seoDictionary),
        "description": seo.vod.watch.getDescription(programInfo),
        "contentUrl": seo.vod.watch.getThumbnailUrl(programInfo)[0],
        "isAccessibleForFree": seo.vod.watch.isAccessibleForFree(programInfo), //Y!要的
        "genre": seo.vod.watch.getGenres(programInfo),
        "keywords": seo.vod.watch.getKeywords(programInfo),
        "author": {
            "@type": "Organization",
            "name": pkg.siteName
        }
    };

    seo.vod.watch.setExpires(obj, programInfo);
    seo.vod.watch.setActor(obj, programInfo);
    seo.vod.watch.setDirector(obj, programInfo);

    if(programInfo.awards){
        obj.award = programInfo.awards;
    }

    return {
        __html: JSON.stringify(obj)
    };
};

export default app;
