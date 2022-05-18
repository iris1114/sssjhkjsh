
import watch from "../../index.js";

const app = (lineup, scheduleAllWithMediumPrograms, programInfo) => {
    let channels = lineup.channels;
    let programs = scheduleAllWithMediumPrograms.Programs;

    for(let i = 0; i < channels.length; i ++){
        let channel = channels[i];
        let schedules = channel.Schedule;

        if(schedules){
            for(let j = 0; j < schedules.length; j ++){
                let schedule = schedules[j];
                let programId = schedule.ProgramId;
                let program = programs[programId];

                schedule.program = program;
            }
        }

        lineup.channels[i] = watch.channel.meta.getPrograms(channel, programInfo);
    }

    return lineup;
};

export default app;
