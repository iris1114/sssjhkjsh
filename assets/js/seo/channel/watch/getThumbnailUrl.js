
const app = (programInfo, introduction) => {
    let contentId = programInfo.content_id;
    let channels = introduction.channels;
    let thumbnails = new Array();

    for(let i = 0; i < channels.length; i ++){
        let channel = channels[i];

        if(channel.cdn_code == contentId){
            thumbnails.push(channel.picture);

            let showcases = channel.showcase;

            for(let j = 0; j < showcases.length; j ++){
                let showcase = showcases[j];

                thumbnails.push(showcase.picture);
            }

            return thumbnails;
        }
    }

    thumbnails.push(`${litv.config.cdnstatic}/${programInfo.picture}`);
    thumbnails.push("https://www.litv.tv/multiDeviceIntro.png");
    thumbnails.push("https://www.litv.tv/channelsIntro.png");
    thumbnails.push("https://www.litv.tv/seriesIntro.png");

    return thumbnails;
};

export default app;
