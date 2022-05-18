
const app = (lineup) => {
    let channels = lineup.channels;
    let liads = lineup.liads;

    for(let i = 0; i < channels.length; i ++){
        let channel = channels[i];
        let liadId = channel.liad_id;

        channel.liad = liads[liadId];
    }

    return lineup;
};

export default app;
