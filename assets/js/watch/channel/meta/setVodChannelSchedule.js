
const app = (lineup, vodChannelSchedule) => {
    let channels = lineup.channels;

    for(let i = 0; i < channels.length; i ++){
        let channel = channels[i];
        let stationId = channel.station_id;

        if(stationId){
            let station = vodChannelSchedule[stationId];

            if(station){
                channel.vod_channel_schedule = station;
            }
        }
    }

    return lineup;
};

export default app;
