
const app = (lineup) => {
    let channels = lineup.channels;
    let map = {};

    for(let i = 0; i < channels.length; i ++){
        let channel = channels[i];
        let contentId = channel.content_id;
        
        map[contentId] = channel;
    }
    
    return map;
};

export default app;
