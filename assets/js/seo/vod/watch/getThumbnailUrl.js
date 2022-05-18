
const app = (programInfo) => {
    let config = litv.config;
    let thumbnails = new Array();
    let video = programInfo.video_image;
    let poster = programInfo.picture;

    if(video){
        thumbnails.push(`${config.cdnstatic}/${video.replace("-S", "")}`);
        thumbnails.push(`${config.cdnstatic}/${video}`);
        thumbnails.push(`${config.cdnstatic}/${poster}`);
    }
    else{
        thumbnails.push(`${config.cdnstatic}/${poster}`);
        thumbnails.push("https://www.litv.tv/multiDeviceIntro.png");
        thumbnails.push("https://www.litv.tv/channelsIntro.png");
        thumbnails.push("https://www.litv.tv/seriesIntro.png");
    }
    
    return thumbnails;
};

export default app;
