
import seo from "../index.js";

const app = (searchByPattern) => {
    let obj = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": []
    };

    for(let i = 0; i < searchByPattern.length; i ++){
        let item = searchByPattern[i];

        obj.itemListElement.push({
            "@type": "ListItem",
            "position": i + 1,
            "url": seo.vod.watch.getUrl(item)
        });
    }
    
    return {
        __html: JSON.stringify(obj)
    };
};

export default app;
