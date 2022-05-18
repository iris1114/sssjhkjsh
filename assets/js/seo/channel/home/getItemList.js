
import seo from "../../index.js";

const app = (introduction) => {
    let obj = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": []
    };

    let count = 1;

    for(let i = 0; i < introduction.channels.length; i ++){
        let channel = introduction.channels[i];

        obj.itemListElement.push({
            "@type": "ListItem",
            "position": count ++,
            "url": seo.channel.watch.getUrl({
                content_id: channel.cdn_code
            })
        });
    }
    
    return {
        __html: JSON.stringify(obj)
    };
};

export default app;
