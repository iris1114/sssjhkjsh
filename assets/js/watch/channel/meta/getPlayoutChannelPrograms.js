
import watch from "../../index.js";

const defaultPrograms = (channel) => {
    channel = watch.channel.meta.setPlayoutChannelProgramEndTime(channel);
    
    let vodChannelSchedule = channel.vod_channel_schedule;

    vodChannelSchedule.focus_index = 0;
    vodChannelSchedule.midroll_before_start = false;
    vodChannelSchedule.midroll_before_start_duration = 0;

    let programs = vodChannelSchedule.programs;
    let now = new Date().getTime();

    for(let i = 0; i < programs.length; i ++){
        let program = programs[i];

        if(now >= program.p_start && now < program.p_end){
            vodChannelSchedule.focus_index = i;

            break;
        }
    }

    vodChannelSchedule.focus_program = programs[vodChannelSchedule.focus_index];
    vodChannelSchedule.time = now - vodChannelSchedule.focus_program.p_start;
    vodChannelSchedule.next_index = vodChannelSchedule.focus_index + 1;

    if(vodChannelSchedule.next_index >= programs.length){
        vodChannelSchedule.next_index = 0;
    }

    let timecodes = vodChannelSchedule.focus_program.time_codes;

    for(let i = 0; i < timecodes.length; i ++){
        let startTime = timecodes[i];
        let duration = vodChannelSchedule.focus_program.timecode_duration[i];
        let endTime = startTime + duration;

        if(vodChannelSchedule.time >= startTime && vodChannelSchedule.time < endTime){
            vodChannelSchedule.midroll_before_start = true;
            vodChannelSchedule.midroll_before_start_duration = endTime - vodChannelSchedule.time;

            break;
        }
    }
    
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
        channel.vod_channel_schedule.midroll_before_start = false;
        channel.vod_channel_schedule.midroll_before_start_duration = 0;

        return channel;
    }

    return defaultPrograms(channel);
};

export default app;
