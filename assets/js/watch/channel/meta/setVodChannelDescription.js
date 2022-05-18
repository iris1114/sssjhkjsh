
const formatDescription = (vodChannelDescription) => {
    let contentIds = vodChannelDescription.contentIds;
    let descriptions = vodChannelDescription.descriptions;
    let result = {};

    for(let i = 0; i < contentIds.length; i ++){
        let _contentIds = contentIds[i];

        for(let j = 0; j < _contentIds.length; j ++){
            let contentId = _contentIds[j];

            result[contentId] = descriptions[i];
        }
    }

    return result;
};

const app = (lineup, vodChannelDescription) => {
    vodChannelDescription = formatDescription(vodChannelDescription);
    
    let channels = lineup.channels;

    for(let i = 0; i < channels.length; i ++){
        let channel = channels[i];

        if(channel.content_type == "vod-channel" || channel.content_type == "playout-channel"){
            let vodChannelSchedule = channel.vod_channel_schedule;
            let programs = vodChannelSchedule.programs;

            for(let j = 0; j < programs.length; j ++){
                let program = programs[j];
                let contentId = program.content_id;
                let description = vodChannelDescription[contentId];
                
                if(channel.content_type == "vod-channel"){
                    program.vod_channel_description = description;
                }
                else{
                    program.vod_channel_description = description;
                }
            }
        }
    }

    return lineup;
};

export default app;
