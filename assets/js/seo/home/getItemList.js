
import seo from "../index.js";

const app = (mainContent, homeChannel) => {
    let obj = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": []
    };

    let channels = homeChannel.list;
    let urls = new Array();
    let count = 1;

    for(let i = 0; i < channels.length; i ++){
        let channel = channels[i];
        let url = seo.channel.watch.getUrl(channel);

        obj.itemListElement.push({
            "@type": "ListItem",
            "position": count ++,
            "url": url
        });
    }

    for(let i = 0; i < mainContent.length; i ++){
        let content = mainContent[i];

        for(let j = 0; j < content.programs.length; j ++){
            let program = content.programs[j];
            let url = seo.vod.watch.getUrl(program);

            if(urls.indexOf(url) == -1){
                urls.push(url);

                obj.itemListElement.push({
                    "@type": "ListItem",
                    "position": count ++,
                    "url": url
                });
            }
        }
    }
    
    return {
        __html: JSON.stringify(obj)
    };
};

export default app;
