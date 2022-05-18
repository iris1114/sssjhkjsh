
import seo from "../../index.js";

const app = (searchProgram) => {
    let obj = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": []
    };
    
    let count = 1;
    let programs = searchProgram.programs;


    for(let i = 0; i < programs.length; i ++){
        let program = programs[i];

        obj.itemListElement.push({
            "@type": "ListItem",
            "position": count ++,
            "url": seo.vod.watch.getUrl(program)
        });
    }
    
    return {
        __html: JSON.stringify(obj)
    };
};

export default app;
