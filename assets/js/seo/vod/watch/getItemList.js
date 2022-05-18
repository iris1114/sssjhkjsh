
import seo from "../../index.js";

const app = (relatedProgram) => {
    let obj = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": []
    };

    let count = 1;

    for(let i = 0; i < relatedProgram.data.length; i ++){
        let data = relatedProgram.data[i];
        let programs = data.programs;

        for(let j = 0; j < programs.length; j ++){
            obj.itemListElement.push({
                "@type": "ListItem",
                "position": count ++,
                "url": seo.vod.watch.getUrl(programs[j])
            });
        }
    }
    
    return {
        __html: JSON.stringify(obj)
    };
};

export default app;
