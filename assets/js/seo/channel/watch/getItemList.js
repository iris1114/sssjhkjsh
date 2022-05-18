
import seo from "../../index.js";

const app = (lineup) => {
    let obj = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": []
    };

    let count = 1;

    for(let i = 0; i < lineup.channels.length; i ++){
        let item = lineup.channels[i];

        obj.itemListElement.push({
            "@type": "ListItem",
            "position": count ++,
            "url": seo.channel.watch.getUrl({
                content_id: item.content_id
            })
        });
    }
    
    return {
        __html: JSON.stringify(obj)
    };
};

export default app;
