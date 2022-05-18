
import watch from "../../index.js";

const app = (channel) => {
    if(channel.content_type == "vod-channel"){
        return watch.channel.meta.getVodChannelNextProgram(channel);
    }
    else if(channel.content_type == "playout-channel"){
        return watch.channel.meta.getPlayoutChannelNextProgram(channel);
    }

    return null;
};

export default app;
