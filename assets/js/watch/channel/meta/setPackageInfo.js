
const app = (lineup) => {
    let channels = lineup.channels;
    let packageInfos = lineup.package_infos;

    for(let i = 0; i < channels.length; i ++){
        let channel = channels[i];
        let packageInfoId = channel.package_info_id;

        channel.package_info = packageInfos[packageInfoId];
    }

    return lineup;
};

export default app;
