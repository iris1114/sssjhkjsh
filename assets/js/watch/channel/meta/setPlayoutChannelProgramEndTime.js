
const app = (channel) => {
    let vodChannelSchedule = channel.vod_channel_schedule;
    let programs = vodChannelSchedule.programs;

    for(let i = 0; i < programs.length; i ++){
        let program = programs[i];

        if(i < programs.length - 1){
            program.p_end = programs[i + 1].p_start;
        }
        else{
            let timecodeDurations = program.timecode_duration;
            let sumOfTimecodeDuration = 0;

            for(let j = 0; j < timecodeDurations.length; j ++){
                let timecodeDuration = timecodeDurations[j];

                sumOfTimecodeDuration += timecodeDuration;
            }

            program.p_end = program.p_start + program.length + sumOfTimecodeDuration;
        }
    }

    return channel;
};

export default app;
