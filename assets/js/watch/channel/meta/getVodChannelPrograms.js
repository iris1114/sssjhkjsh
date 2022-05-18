
const defaultPrograms = (channel) => {
    let vodChannelSchedule = channel.vod_channel_schedule;
    let programs = vodChannelSchedule.programs;
    let totalLength = vodChannelSchedule.total_length;
    let startTime = vodChannelSchedule.start_time;
    let now = new Date().getTime();
    let gap = now - startTime;
    let remain = gap % totalLength;

    let focusIndex = 0;
    let time = 0;
    let tLength = 0;

    for(let i = 0; i < programs.length; i ++){
        let program = programs[i];
        let _length = program.length;

        tLength += _length;

        if(tLength > remain){
            focusIndex = i;
            time = _length - (tLength - remain);

            break;
        }
    }

    let nextIndex = focusIndex + 1;

    if(nextIndex >= programs.length){
        nextIndex = 0;
    }

    vodChannelSchedule.focus_index = focusIndex;
    vodChannelSchedule.next_index = nextIndex;
    vodChannelSchedule.time = time;
    vodChannelSchedule.focus_program = programs[focusIndex];
    
    return channel;
};

const app = (channel, programInfo) => {
    if(!programInfo){
        return defaultPrograms(channel);
    }
    
    if(channel.content_id == programInfo.content_id){
        let programs = channel.vod_channel_schedule.programs;

        channel.vod_channel_schedule.focus_index = programInfo.vod_channel_schedule.focus_index;
        channel.vod_channel_schedule.next_index = programInfo.vod_channel_schedule.next_index;
        channel.vod_channel_schedule.time = 0;
        channel.vod_channel_schedule.focus_program = programs[channel.vod_channel_schedule.focus_index];

        return channel;
    }

    return defaultPrograms(channel);
};

export default app;
