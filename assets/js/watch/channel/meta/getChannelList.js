
import _ from "lodash";

const app = (lineup) => {
    let channels = lineup.channels;

    channels = _.cloneDeep(channels);

    return channels.sort((a, b) => {
        return parseInt(a.no) - parseInt(b.no);
    });
}

export default app;
