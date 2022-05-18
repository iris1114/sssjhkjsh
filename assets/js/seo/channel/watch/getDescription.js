
const app = (programInfo, introduction) => {
    let contentId = programInfo.content_id;
    let channels = introduction.channels;

    for(let i = 0; i < channels.length; i ++){
        let channel = channels[i];

        if(channel.cdn_code == contentId){
            return channel.description;
        }
    }

    return `${programInfo.title}頻道直播以及完整的電視節目表。同步電視頻道直播新聞、財經、體育賽事與綜藝娛樂等多種類型第四台頻道，將傳統第四台訊號同步網路直播，內容均合法取得。`;
};

export default app;
