
import watch from "../../index.js";

const app = (channel, programInfo) => {
    if(channel.content_type == "vod-channel"){
        return watch.channel.meta.getVodChannelPrograms(channel, programInfo);
    }
    else if(channel.content_type == "playout-channel"){
        return watch.channel.meta.getPlayoutChannelPrograms(channel, programInfo);
    }
    else if(channel.content_type == "channel"){
        return watch.channel.meta.getChannelPrograms(channel);
    }

    return null;
};

export default app;
