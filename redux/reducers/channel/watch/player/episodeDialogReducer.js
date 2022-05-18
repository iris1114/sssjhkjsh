
const app = (state = null, action) => {
    switch(action.type){
        case "channel/watch/player/episodeDialog":
            return action.value;
        default:
            return state;
    };
};

export default app;