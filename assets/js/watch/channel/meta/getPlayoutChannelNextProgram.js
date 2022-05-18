
import watch from "../../index.js";

const app = (channel) => {
    let vodChannelSchedule = channel.vod_channel_schedule;
    let nextIndex = vodChannelSchedule.next_index;
    
    if(nextIndex <= 0){
        channel = watch.channel.meta.setPlayoutChannelProgramEndTime(channel);
    }

    let programs = vodChannelSchedule.programs;
    let program = programs[nextIndex];

    vodChannelSchedule.focus_index = nextIndex;
    nextIndex = nextIndex + 1;

    if(nextIndex >= programs.length){
        nextIndex = 0;
    }

    vodChannelSchedule.next_index = nextIndex;
    vodChannelSchedule.focus_program = program;
    vodChannelSchedule.time = 0;
    vodChannelSchedule.midroll_before_start = false;
    vodChannelSchedule.midroll_before_start_duration = 0;

    return channel;
};

export default app;
