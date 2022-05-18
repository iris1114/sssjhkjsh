
import seo from "../../index.js";

const app = (searchProgram) => {
    let obj = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": []
    };
    
    let count = 1;

    for(let i = 0; i < searchProgram.programs.length; i ++){
        let program = searchProgram.programs[i];

        obj.itemListElement.push({
            "@type": "ListItem",
            "position": count ++,
            "url": seo.vod.watch.getUrl({
                content_type: program.content_type,
                content_id: program.content_id
            })
        });
    }
    
    return {
        __html: JSON.stringify(obj)
    };
};

export default app;
