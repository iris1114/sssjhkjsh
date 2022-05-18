
const app = (channel) => {
    let schedules = channel.Schedule;

    if(!schedules){
        channel.Schedule = new Array();

        return channel;
    }

    let now = new Date().getTime();
    let _schedules = new Array();
    
    for(let i = 0; i < schedules.length; i ++){
        if(i < schedules.length - 1){
            let schedule = schedules[i + 1];
            let airDateTime = Date.parse(schedule.AirDateTime);

            if(airDateTime > now){
                _schedules.push(schedules[i]);
            }
        }
        else{
            let schedule = schedules[i];
            let airDateTime = Date.parse(schedule.AirDateTime);

            if(airDateTime > now){
                _schedules.push(schedule);
            }
        }
    }
    
    channel.Schedule = _schedules;
    
    return channel;
};

export default app;
