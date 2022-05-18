
const app = (programInfo, introduction) => {
    let contentId = programInfo.content_id;
    let channels = introduction.channels;
    let keywords = new Array();

    keywords.push(programInfo.title);
    
    for(let i = 0; i < channels.length; i ++){
        let channel = channels[i];

        if(channel.cdn_code == contentId){
            let showcases = channel.showcase;

            for(let j = 0; j < showcases.length; j ++){
                let showcase = showcases[j];

                keywords.push(showcase.title);
            }
        }
    }
    
    keywords = keywords.join(",");
    keywords = `${keywords},頻道,直播,整套看,第四台,節目表,新聞,財經,體育,綜藝`;

    return keywords;
};

export default app;
