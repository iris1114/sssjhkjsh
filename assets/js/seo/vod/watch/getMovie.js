
import seo from "../../index.js";

import pkg from "../../../../../package.json";

const app = (programInfo) => {
    let obj = {
        "@context": "https://schema.org",
        "@type": "Movie",
        "url": seo.vod.watch.getUrl(programInfo),
        "name": seo.vod.watch.getTitleWithSecondaryMark(programInfo),
        "image": litv.config.cdnstatic + "/" + programInfo.picture,
        "dateCreated": seo.vod.watch.getUploadDate(programInfo)
    };

    if(programInfo.score){
        obj.review = {
            "@type": "Review",
            "reviewRating": {
                "@type": "Rating",
                "ratingValue": parseFloat(programInfo.score) / 2
            },
            "author": {
                "@type": "Organization",
                "name": pkg.siteName
            }
        };

        if(programInfo.awards){
            obj.review.reviewBody = programInfo.awards;
        }
    }

    seo.vod.watch.setDirector(obj, programInfo);

    return {
        __html: JSON.stringify(obj)
    };
};

export default app;
