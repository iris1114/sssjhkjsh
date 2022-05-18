
const app = (lineup) => {
    let channels = lineup.channels;
    
    for(let i = 0; i < channels.length; i ++){
        let channel = channels[i];
        
        if(channel.content_type == "vod-channel" || channel.content_type == "playout-channel"){
            let vodChannelSchedule = channel.vod_channel_schedule;

            vodChannelSchedule.start_time = vodChannelSchedule.start_time * 1000;
            vodChannelSchedule.total_length = vodChannelSchedule.total_length * 1000;

            let programs = vodChannelSchedule.programs;
            
            for(let j = 0; j < programs.length; j ++){
                let program = programs[j];
                
                if(program.p_start){
                    program.p_start = parseInt(program.p_start) * 1000;
                }
                
                program.length = parseInt(program.length) * 1000;

                if(!program.time_codes){
                    program.time_codes = new Array();
                }
                
                let timeCodes = program.time_codes;
					
                for(let k = 0; k < timeCodes.length; k ++){
                    timeCodes[k] = parseInt(timeCodes[k]) * 1000;
                }
                
                if(!program.timecode_duration){
                    program.timecode_duration = new Array();
                }
                
                let timecodeDurations = program.timecode_duration;
                
                for(let k = 0; k < timecodeDurations.length; k ++){
                    timecodeDurations[k] = parseInt(timecodeDurations[k]) * 1000;
                }
            }
        }
    }

    return lineup;
};

export default app;
