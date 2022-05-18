
import seo from "../../index.js";

const app = (list) => {
    let obj = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": []
    };

    let summaryTable = list.summary_table;
    let count = 1;

    for(let i = 0; i < summaryTable.list.length; i ++){
        let channel = summaryTable.list[i];

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
