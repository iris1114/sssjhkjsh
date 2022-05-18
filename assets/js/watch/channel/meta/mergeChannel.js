
const app = (lineup, scheduleAllWithMediumPrograms) => {
    let channels = lineup.channels;
    let _channels = scheduleAllWithMediumPrograms.Channels;

    for(let i = 0; i < channels.length; i ++){
        let channel = channels[i];
        let contentId = channel.content_id;

        for(let j = 0; j < _channels.length; j ++){
            let _channel = _channels[j];
            let cdnCode = _channel.CdnCode;

            if(contentId == cdnCode){
                for(let key in _channel){
                    channel[key] = _channel[key];
                }
            }
        }
    }

    return lineup;
};

export default app;
